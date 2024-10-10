const sequelize = require('../config/db');
const User = require('./user');
const Category = require('./category');
const Password = require('./password');

// Define relationships

User.hasMany(Password, {foreignKey: 'UserId', onDelete: 'CASCADE'});
Password.belongsTo(User, { foreignKey: 'UserId' });

Category.hasMany(Password, {foreignKey: 'CategoryId', onDelete: 'CASCADE'})
Password.belongsTo(Category, { foreignKey: 'CategoryId' });

// Export the models and sequelize instance
const db = {
    sequelize,
    User,
    Category,
    Password,
};

module.exports = db;