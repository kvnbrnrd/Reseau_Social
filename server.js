const express = require('express');
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
require('dotenv').config({path: './config/.env'})
require('./config/db');
const {checkUser, requireAuth} = require("./middleware/auth.middleware");
const app = express();


app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


// jwt
// For each request, we verify the user's token (auth.middleware.js)
app.get('*', checkUser);

// requireAuth is called to send the id of the user logging in (auth.middleware.js)
app.get("/jwtid", requireAuth, (req,res) => {
    res.status(200).send(res.locals.user._id);
});

// routes
// Defines the main route and where to find the other routes (user.routes.js)
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// server
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})