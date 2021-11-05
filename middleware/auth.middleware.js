const jwt = require('jsonwebtoken');
const UserModel = require("../models/user.model");

// Verifies at each request that the user bearing the token corresponds to the right user in the DB. (GET request, any route)
module.exports.checkUser = (req,res,next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err,decodedToken) => {
            if (err) {
                res.locals.user = null;
                // res.cookie('jwt','', {maxAge: 1});
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

// On login, checks if the token is possessed by someone in the database. (GET request, /jwtid)
module.exports.requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async(err,decodedToken) => {
            if (err) { 
                console.log(err);
            } else {
                console.log(decodedToken.id);
                next();
            }
        });
    } else {
        console.log("No token");
    }
}