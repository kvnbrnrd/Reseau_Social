const UserModel = require("../models/user.model");
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000; // the validity duration of the cookie (24 * 60 * 60 * 1000 = 1 day, so 3 days here)
const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

// Allows for the user to sign up, providing a pseudo, email and password. (POST request, /register)
module.exports.signUp = async (req, res) => {
    const {pseudo, email, password} = req.body

    try {
        const user = await UserModel.create({pseudo, email, password});
        res.status(201).json({user: user._id});
    } 
    catch(err) {
        res.status(200).send({err});
    }
}

// Allows the user to login by checking email, password and then creates a token to store in the cookies. (POST request, /login)
module.exports.signIn = async (req,res) => {
    const {email,password} = req.body;

    try {
        const user = await UserModel.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge:maxAge})
        res.status(200).json({user: user._id})
    } catch (err) {
        res.status(200).json(err);
    }
}

// Logs the user out by removing the cookie and redirecting to the home page. (GET request, /logout)
module.exports.logout = (req,res) => {
    res.cookie('jwt', '', {maxAge : 1});
    res.redirect('/');
}