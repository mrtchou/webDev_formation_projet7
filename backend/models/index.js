const dbConfig = require("../config/db");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  socketPath: dbConfig.SOCKET,
  port: dbConfig.PORT,
  dialect: dbConfig.DIALECT,

});







const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);

//Liaison entre tables
db.post.belongsTo(db.user);
db.user.hasMany(db.post);

module.exports = db;
