// Sequelize
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('admin', {
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
    centerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Admin;