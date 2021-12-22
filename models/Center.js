// Sequelize
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Center = sequelize.define('center', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Center;