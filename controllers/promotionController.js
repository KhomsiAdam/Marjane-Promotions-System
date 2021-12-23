// Validator
const { validationResult } = require('express-validator');

// Models
const Promotion = require('../models/Promotion');
const Product = require('../models/Product');
const Manager = require('../models/Manager');

exports.create = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const discount = req.body.discount;
    const day = req.body.day;
    const productId = req.body.productId;
    const centerId = req.centerId;
    const fidelity = (discount / 5) * 50;
    console.log(discount + '%');
    console.log(fidelity + 'dh');

    Product.findOne({ where: { id: productId }, raw: true })
        .then(product => {
            if (!product) {
                const error = new Error('A product with this id could not be found.');
                error.statusCode = 401;
                throw error;
            }
            console.log(product);
            if ((product.category === 'Multimedia' && discount <= 20) || (product.category !== 'Multimedia' && discount <= 50)) {
                console.log('OK');
                const promotion = new Promotion({
                    discount: discount,
                    fidelity: fidelity,
                    status: 'Pending',
                    currentStock: product.quantity,
                    day: day,
                    productId: productId,
                    centerId: centerId
                });
                promotion
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Promotion created successfully!',
                            promotion: result
                        });
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
            } else if ((product.category === 'Multimedia' && discount > 20) || (product.category !== 'Multimedia' && discount > 50)) {
                console.log('NO');
                let message;
                if (product.category === 'Multimedia') {
                    message = 'Product discount of Multimedia category must not exceed 20%.';
                } else {
                    message = 'Product discount must not exceed 50%.';
                }
                res.status(400).json({
                    message: message
                });
            }
        })
};

exports.getMyPromotions = (req, res, next) => {
    // Get current date
    const date = new Date();
    
    let hour = date.getHours();

    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear()

    let fullDate = year + "-" + month + "-" + day;

    // Check if current hour is between 8am and 12pm
    if (hour >= 8 && hour <= 12) {
        // Get all promotions affected to the manager by category and center with product informations
        Promotion.findAll({ include: [{ model: Product, where: { category: req.category } }], where: { centerId: req.centerId, status: 'Untreated', day: fullDate }, raw: true })
            .then(promotions => {
                if (promotions.length > 0) {
                    res.status(200).json({
                        message: `Promotions of category ${req.category} fetched successfully`,
                        promotions: promotions
                    });
                } else {
                    res.status(200).json({
                        message: 'There are no promotions available.'
                    });
                }
            })
    } else {
        res.status(200).json({
            message: 'You are connected outside of the given time range.'
        });
    }
};

exports.updatePromotion = (req, res, next) => {
    const promotionId = req.body.promotionId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
    }
    const status = req.body.status;
    const comment = req.body.comment;
    const currentStock = req.body.currentStock;
    Promotion.update({ status: status, comment: comment, currentStock: currentStock }, { where: { id: promotionId } })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: 'Promotion updated!' });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};