//13.1.4 - import the sequelize constructor
const Sequelize = require('sequelize');

require('dotenv').config(); 

//13.1.4 - create connection to our databse, pass in MySQL info
let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize; 