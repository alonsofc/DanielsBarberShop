const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Cita = sequelize.define(
  "citas",
  {
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
    sinpe: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false, // Desactiva las columnas createdAt y updatedAt
  }
);

module.exports = Cita;
