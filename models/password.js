const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Password = sequelize.define('Password', {
    PasswordId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    AccountName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AccountId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    AccountPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Passwords',
    timestamps: true
});

module.exports = Password;