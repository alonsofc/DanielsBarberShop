const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Cita = sequelize.define("citas", {
  start: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Cita;
