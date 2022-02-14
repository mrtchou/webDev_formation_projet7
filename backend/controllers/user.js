const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { tokenJWT } = require("../config.json");
const { ancienEmployee } = require("../config.json");

const User = db.user;
const regexEmail = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;


/**
 * pour lire les données HTTP POST, utilise "body-parser". 
 * body-parser est un middleware express qui lit l'entrée d'un formulaire 
 * et le stocke en tant qu'objet javascript accessible via req.body
 */

//Création d'un utilisateur
exports.createUser = (req, res, next) => {
  if (!req.body.email || !req.body.pseudo || !req.body.password) {
    return res.status(400).json({
      message: "absence de data dans formulaire",
    });
  } else if (!regexEmail.test(req.body.email)) {
    return res.status(400).json({
      message: "Mauvais requette.",
    });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = {
        email: req.body.email,
        pseudo: req.body.pseudo,
        password: hash,
        is_admin: req.body.is_admin,
      };
      User.create(user)
        .then(() => {
          res.status(200).json({
            message: "success : Utilisateur a bien ete créé",
          });
        })
        .catch((err) => {
          if ((err.errors[0].message = "users.email doit etre unique. ")) {
            res.status(409).json({ message: "erreur pour la creation utilisateur" });

          } else {
            res.status(500).json({ err });
          }
        });
    })
    .catch((err) => res.status(500).json({ err }));
};









//Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "authentification echoué",
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              message: "authentification echoué",
            });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign({ userId: user.id }, tokenJWT, { expiresIn: "24h" }),
          });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};









//Récupération d'un utilisateur
exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "Utilisateur n'a pas ete trouvé ou n'existe pas.",
        });
      }
      res.status(200).json({
        admin: user.is_admin,
        userId: user.id,
        email: user.email,
        pseudo: user.pseudo,
      });
    })
    .catch((err) => res.status(500).json({ err }));
};









//Modification d'un utilisateur
exports.modifyUser = (req, res, next) => {
  let password;
  if (req.body.password) {
    bcrypt.hash(req.body.password, 10).then((hash) => {
      password = hash;
    });
  }
  const user = {
    email: req.body.email,
    pseudo: req.body.pseudo,
    password,
    is_admin: req.body.is_admin,
  };
  User.update(user, {
    where: { id: req.params.id },
  })
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "utilisateur non trouvé",
        });
      } else {
        res.status(200).json({ message: "utilisateur a bien été modifié" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};



//anonymisation utilisateur (regle europeennes RGPD.)
exports.deleteUser = (req, res, next) => {
  User.update(
    {

      email: "ancien employé compte supprimé le: " + new Date(),
      pseudo: "compte supprimé",
      password: Math.random(),
      is_admin: 0,
    },
    {
      where: { id: req.params.id },
    }
  )
    .then((data) => {
      if (data[0] === 0) {
        return res.status(404).json({
          message: "user not found",
        });
      } else {
        res.status(200).json({ message: "user deleted" });
      }
    })
    .catch((err) => res.status(500).json({ err }));
};
