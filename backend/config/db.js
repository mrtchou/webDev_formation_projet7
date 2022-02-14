module.exports = {
  //Connexion à MySQL
  HOST: "localhost",
  user: 'root',
  password: 'root',
  database: 'groupomania',
  dialect: 'mysql',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
};

///!!!!!!!!!a relier au fichier index.js dans models car les données ne doivent pas etre transmis avec le code pour DB
