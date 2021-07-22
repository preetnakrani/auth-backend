const Sequelize = require("sequelize");

module.exports = new Sequelize(
  process.env.dbName,
  process.env.dbUser,
  process.env.dbPassword,
  {
    host: process.env.dbHost,
    dialect: "postgres",
    port: process.env.dbPort,
  }
);
