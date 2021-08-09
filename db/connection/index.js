const Sequelize = require("sequelize");

module.exports = new Sequelize(
  process.env.dbName,
  process.env.dbUser,
  process.env.dbPassword,
  {
    host: process.env.dbHost,
    dialect: "postgres",
    port: process.env.dbPort,
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    native: process.env.dbNative,
  }
);
