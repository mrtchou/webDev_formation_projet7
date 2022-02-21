const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

const db = require("./models/index");
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Synchronisation avec la base de données");
  });


app.use(cors());//active les en tete
app.use(bodyParser.json()); //examine les requêtes Content-Type: application/jsonen-tête et transforme en variables accessibles JS sous req.body
app.use(bodyParser.urlencoded({ extended: true })); //extended: true précise que req.body contiendra valeurs de n'importe quel type

require("./routes/user")(app);
require("./routes/post")(app);



module.exports = app;
