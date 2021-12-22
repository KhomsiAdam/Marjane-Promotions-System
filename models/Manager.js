// Sequelize
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('manager', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    category: {
        type: Sequelize.STRING,
        allowNull: false
    },
    centerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Manager;