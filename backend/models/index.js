// module de connexion à la base de données

const Sequelize = require("sequelize");


const db = {};

// Configuration de Sequelize - connexion a la database
const sequelize = new Sequelize('groupomania', 'root', 'root', {
  host: 'localhost',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
  port: 8889,
  user: 'root',
  password: 'root',
  database: 'groupomania',
  dialect: 'mysql'
});



db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);

//Liaison entre tables
db.post.belongsTo(db.user);
db.user.hasMany(db.post);

module.exports = db;
