const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/database");

module.exports = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
