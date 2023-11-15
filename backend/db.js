const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "azihmlbh",
  "azihmlbh",
  "WBPba0HAHJRZ3qHIQ0frAlaUNXIcEGdN",
  {
    host: "hansken.db.elephantsql.com",
    dialect: "postgres",
  }
);

module.exports = sequelize;
