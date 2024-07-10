const database = require("./db.js");
const sequelize = require("sequelize");

const User = database.define("user",
    {
        id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: sequelize.STRING,
            allowNull: false
        },
        email: {
            type: sequelize.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: sequelize.STRING,
            allowNull: false,
            defaultValue: "user"
        }
    }
);

module.exports = User;