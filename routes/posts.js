var express = require('express');
var router = express.Router();

const { User, Post } = require('../models')
const { verifyToken, IsUser, IsAdmin } = require('../middleware/auth')

// GET all the posts
router.get('/', verifyToken, async function(req, res){
    try {
        const posts = await Post.findAll({ include: [User] });

        return res.json(posts);
    } catch (err) {
        console.log(err);

        return res.status(500).json(err);
    }
})

router.post('/', verifyToken, async function(req, res){
    const { body } = req.body;
    const email = req.user.email;
    try {
        const user = await User.findOne({ where: { email } });
        const post = await Post.create({ body, userId: user.id });

        return res.json(post);
    } catch(err) {
        console.log(err);

        return res.status(500).json(err);
    }
})

module.exports = router;