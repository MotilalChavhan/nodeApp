var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Post } = require('../models')
const { verifyToken, IsUser, IsAdmin } = require('../middleware/auth')

/* GET users listing. */
router.get('/', verifyToken, async function(req, res) {
  try {
    const users = await User.findAll({ include: [Post] })
    return res.json(users)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
});

// GET user with specified id
router.get('/:id', verifyToken, async function(req, res) {
  const id = req.params.id
  try {
    const user = await User.findOne({
      where: { id },
      include: [Post]
    })
    return res.json(user)
  }
  catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// POST user data 
router.post('/', verifyToken, IsAdmin, async function(req, res) {
  const { firstName, lastName, age, addressLine1, addressLine2, city, state, country, email, password, userTypeId } = req.body
  
  try {
    // Validate user input
    if (!(email && password && firstName && lastName && age && addressLine1 && addressLine2 && city && state && country)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({
      where: { email }
    });

    console.log(oldUser)

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
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// PUT user data with specified id
router.put('/:id', verifyToken, IsAdmin, async function(req, res) {
  const { firstName, lastName, age, addressLine1, addressLine2, city, state, country, email, password, userTypeId } = req.body
  const id = req.params.id
  
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.update( { firstName, lastName, age, addressLine1, addressLine2, city, state, country, email, password: encryptedPassword, userTypeId }, {
      where: { id }
    })
    if (user == 1)
      return res.json({ "msg": "user data updated successfully!" })
    else
      return res.json({ "msg": "user id not valid" })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// DELETE user data with specified id
router.delete('/:id', verifyToken, IsAdmin, async function(req, res) {
  const id = req.params.id

  try {
    const user = await User.destroy({
      where: { id }
    })
    if (user)
      return res.json({ "msg": "user data deleted successfully!" })
    else
      return res.json({ "msg": "user id not valid" })
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

module.exports = router;
