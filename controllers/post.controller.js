const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require('mongoose').Types.ObjectId;

// Displays a post (GET request, /)
module.exports.readPost = (req,res) => {
    PostModel.find((err,docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Failure to get data :' + err)
        }
    })
}

// Creates a post (POST request, /)
module.exports.createPost = async (req,res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        likers: [],
        comments: [],
    })

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
}


module.exports.updatePost = (req,res) => {
    
}


module.exports.deletePost = (req,res) => {
    
}