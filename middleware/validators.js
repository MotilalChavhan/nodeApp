const { validationResult } = require('express-validator');
const { User } = require('../models');

const registrationSchema = {
    firstName: {
        notEmpty: true,
        errorMessage: "firstName field cannot be empty"
    },
    lastName: {
        notEmpty: true,
        errorMessage: "lastName field cannot be empty"
    },
    age: {
        notEmpty: true,
        errorMessage: "Age field cannot be empty"
    },
    password: {
        notEmpty: true,
        errorMessage: "Password must not be empty",
    },
    city: {
        notEmpty: true,
        errorMessage: "city field cannot be empty"
    },
    state: {
        notEmpty: true,
        errorMessage: "state field cannot be empty"
    },
    country: {
        notEmpty: true,
        errorMessage: "country field cannot be empty"
    },
}

const validate = validations => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({
            errors: errors.array()
        });
    };
};

module.exports = { validate, registrationSchema };