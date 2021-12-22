// Sequelize
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const SuperAdmin = sequelize.define('superadmin', {
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
    }
});

module.exports = SuperAdmin;