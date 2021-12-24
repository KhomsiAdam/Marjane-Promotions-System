// dotenv
require("dotenv").config();
// Validator
const { validationResult } = require("express-validator");
// Bcrypt
const bcrypt = require("bcryptjs");
// JWT
const jwt = require("jsonwebtoken");
// Password generator
const generator = require("generate-password");
// Mailer
const mail = require("../helpers/mail");

// Models
const Manager = require("../models/Manager");
const Promotion = require("../models/Promotion");
const Product = require("../models/Product");

//Log
const logController = require("./logController");

// Register
exports.register = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const category = req.body.category;
    const centerId = req.body.centerId;
    // Generate a random password
    const password = generator.generate({
        length: 10,
        numbers: true,
    });
    console.log(password);
    // Send email with credentials
    mail(email, password).catch(console.error);
    // Hash password then create the user
    bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
            const user = new Manager({
                email: email,
                password: hashedPw,
                category: category,
                centerId: centerId,
            });
            return user.save();
        })
        .then((result) => {
            logController.saveLog(
                "Manager",
                result.id,
                "Created",
                `Manager with the id: ${result.id} Created`
            );
            res.status(201).json({ message: "Manager created!" });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// Login
exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    Manager.findOne({ where: { email: email } })
        .then((user) => {
            if (!user) {
                const error = new Error(
                    "A Manager with this email could not be found."
                );
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            // Check password
            return bcrypt.compare(password, user.password);
        })
        .then((isEqual) => {
            if (!isEqual) {
                const error = new Error("Wrong password!");
                error.statusCode = 401;
                throw error;
            }
            // Generate token
            const token = jwt.sign(
                {
                    id: loadedUser.id,
                    centerId: loadedUser.centerId,
                    category: loadedUser.category,
                },
                process.env.MANAGER_KEY,
                { expiresIn: "1h" }
            );
            logController.saveLog(
                "Manager",
                loadedUser.id,
                "Login",
                `Manager with the id: ${loadedUser.id} Logged In`
            );

            // Get current date
            const date = new Date();
            let day = ("0" + date.getDate()).slice(-2);
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let year = date.getFullYear();
            let fullDate = year + "-" + month + "-" + day;
            // Get all promotions of same category of manager to mark as 'Untreated'
            Promotion.findAll({
                include: [{ model: Product, where: { category: loadedUser.category } }],
                where: { status: "Pending", day: fullDate },
                raw: true,
            }).then((promotions) => {
                console.log(promotions);
                promotions.forEach((promotion) => {
                    console.log(promotion);
                    Promotion.update(
                        { status: "Untreated" },
                        { where: { id: promotion.id } }
                    );
                });
            });
            res.status(200).json({
                token: token,
                centerId: loadedUser.centerId,
                category: loadedUser.category,
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
