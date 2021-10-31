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

// Creates a post, needs posterId, message, video, likers and comments as required parameters (POST request, /)
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

// Updates the message of the post (PUT request, /:id (id of the post))
module.exports.updatePost = (req,res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        {$set:updatedRecord},
        {new: true},
        (err,docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log("Update error" + err);
            }
        }
    )
}

// Deletes the whole post (DELETE request, /:id (id of the post))
module.exports.deletePost = (req,res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    PostModel.findByIdAndRemove(req.params.id,(err,docs) => {
            if(!err) {
                res.send(docs);
            } else {
                console.log("Delete error : " + err);
            }
        });
};