const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/database");

module.exports = sequelize.define(
    "episode",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        epi_info: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        running_time: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);