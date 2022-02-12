const Sequelize = require('sequelize');
require('dotenv').config();
const mysql = require('mysql');






// Configuration de Sequelize - connexion a la database
const sequelize = new Sequelize('rest', 'root', 'root', {
    host: 'localhost',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'groupomania',
    dialect: 'mysql'
});



sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });




module.exports = sequelize;

