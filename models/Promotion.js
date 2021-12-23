// Sequelize
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('promotion', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    discount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    fidelity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    day: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    currentStock: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    centerId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Promotion;