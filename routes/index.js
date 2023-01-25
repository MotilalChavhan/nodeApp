var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, checkSchema } = require("express-validator");

require('dotenv').config()

const { User } = require('../models')
const { verifyToken } = require('../middleware/auth')
const { validate, registrationSchema } = require('../middleware/validators')

// Register route
router.post('/register', validate(checkSchema(registrationSchema)), async function(req, res) {
  try {
    // Get user input
    const { firstName, lastName, email, password, age, addressLine1, addressLine2, city, state, country, userTypeId } = req.body;

    // Validate user input
    if (!(email && password && firstName && lastName && age && addressLine1 && addressLine2 && city && state && country)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({
      where: { email }
    });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      age, 
      addressLine1, 
      addressLine2, 
      city, 
      state, 
      country,
      userTypeId
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email, user_type_id: userTypeId },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
})

// Login route
router.post('/login', validate([ body('email').isEmail().normalizeEmail() ]), async function(req, res) {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, user_type_id: user.userTypeId },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
})

/* GET home page. */
router.get('/', verifyToken, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
