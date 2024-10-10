const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
    CategoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CategoryName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Categories',
    timestamps: true
});

module.exports = Category;