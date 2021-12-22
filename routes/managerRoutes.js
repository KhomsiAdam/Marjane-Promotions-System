// Express
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Controllers
const managerController = require('../controllers/managerController');

// Auth
const isManager = require('../middleware/isManager');

// Manager login
router.post('/login', managerController.login);

module.exports = router;
