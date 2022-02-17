<template>
  <b-container>
    <b-row align-h="center">
      <b-col lg="8">
        <h1 align="center" class="mb-4">Mon profil</h1>
        <b-row>
          <b-col
            cols="12"
            offset-sm="1"
            sm="10"
            offset-md="2"
            md="8"
            offset-lg="2"
            lg="8"
          >
            <b-card class="identification-box">
              <!--Formulaire-->
              <div align="center">
                <label for="pseudo">Modifier le pseudo</label>
                <b-form-input
                  id="input-1"
                  class="mb-3 input"
                  v-model="user.pseudo"
                  placeholder="changer mon pseudo"
                  maxlength="10"
                  @input="lenghtCheck(10, user.pseudo, 'pseudo')"
                ></b-form-input>
                <label for="email-adress">Modifier l'adresse email</label>
                <b-form-input
                  id="input-2"
                  class="mb-3 input"
                  v-model="user.email"
                  type="email"
                  placeholder="changer mon adresse email"
                  maxlength="30"
                  @input="lenghtCheck(30, user.email, 'email')"
                ></b-form-input>
              </div>
            </b-card>
            <p class="error-message font-weight-bold text-center mt-2">
              {{ error }}
            </p>
          </b-col>
        </b-row>
        <b-row class="mt-4" align="center">
          <b-col
            offset="1"
            cols="5"
            offset-sm="3"
            sm="3"
            offset-md="3"
            md="3"
            offset-lg="3"
            lg="3"
          >
            <div>
              <b-button
                @click="cancelModification"
                class="mb-2 bg-secondary text-white btn-lg"
                >Annuler les modifications</b-button
              >
            </div>
          </b-col>
          <b-col cols="5" sm="3" md="3" lg="3">
            <div>
              <b-button
                @click="modifyUser"
                class="mb-2 bg-primary text-white btn-lg"
                >Valider les modifications</b-button
              >
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col offset="3" cols="6">
            <div class="mt-4" align="center">
              <b-button
                pill
                size="sm"
                class="btn btn-danger"
                @click="deleteUser"
                >Supprimer mon profil</b-button
              >
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
 
<script>
import { url } from "../main";

export default {
  name: "Profile",
  data() {
    return {
      displayModifyPassword: true,
      password: "",
      user: {},
      uri: "users/" + this.userId,
      error: "",
      pseudoRegex: /^[a-zA-Z0-9]{3,}$/,
      emailRegex:
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      passwordRegex: /^(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  props: {
    userId: {
      type: String,
    },
    displayProfile: {
      type: Boolean,
    },
    token: {
      type: String,
    },
  },
  created() {
    this.getUser();
  },
  watch: {
    error() {
      setTimeout(() => {
        this.error = "";
      }, 10000);
    },
  },
  computed: {
    body() {
      if (this.password === "" || this.password === null) {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
        };
      } else {
        return {
          pseudo: this.user.pseudo,
          email: this.user.email,
          password: this.password,
        };
      }
    },
  },

  methods: {
    //limitation du nombre de caracteres ave affichage message en plus de limitation html
    lenghtCheck(length, object, message) {
      if (object.length > 30) {
        this.error = "Votre " + message + " est trop long";
      } else {
        this.error = "";
      }
    },

    switchDisplayProfile() {
      //dès que clic sur modifier ou anuler retour au forum (emission vers le parent)
      //événement est émis, le composant parent qui utilise le composant enfant
      // est capable d'écouter l'événement via la directive  v-on(@)
      let emitDisplayProfile = !this.displayProfile;
      this.$emit("display-profile", emitDisplayProfile);
    },
    switchDisplayModifyPassword() {
      this.displayModifyPassword = !this.displayModifyPassword;
    },
    getUser() {
      this.$http.get(url + "users/" + this.userId, this.headers).then((res) => {
        this.user = res.data;
      });
    },
    modifyUser() {
      if (!this.emailRegex.test(this.body.email)) {
        return (this.error = "Vous devez renseigner une adresse email valide");
      } else if (!this.pseudoRegex.test(this.body.pseudo)) {
        return (this.error =
          "Votre pseudo doit contenir au moins 5 ou plus de caractères");
      } else if (this.body.password) {
        if (!this.passwordRegex.test(this.password)) {
          return (this.error =
            "Votre mot de passe doit contenir au moins 8 caractères et au moins 1 lettre et 1 chiffre");
        }
      }

      let formData = new FormData();
      formData.append("pseudo", this.body.pseudo);
      formData.append("email", this.body.email);
      formData.append("user_id", this.userId);
      if (this.body.password) {
        formData.append("password", this.body.password);
      }
      this.$http
        .put(url + this.uri, formData, this.headers)
        .then(() => {
          this.$parent.getPosts();
          this.switchDisplayProfile();
        })
        .catch(() => {
          this.error = "Veuillez réessayer";
        });
    },
    //annulation modification profil, remet tous les infos comme ils etaient plus retour au forum
    cancelModification() {
      this.getUser();
      this.password = "";
      this.pseudo = "";
      this.displayModifyPassword = true;
      this.switchDisplayProfile();
    },
    deleteUser() {
      let deleteConfirm = confirm(
        //apparition de la fenêtre popup pour confirmer delete user
        "Attention Cette action est definitive."
      );
      if (deleteConfirm) {
        this.$http
          .delete(url + this.uri, this.headers)
          .then(() => {
            this.logout();
          })
          .catch(() => {
            this.error = "Veuillez réessayer";
          });
      }
    },
    logout() {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
</style>
