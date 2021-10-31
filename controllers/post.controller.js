const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require('mongoose').Types.ObjectId;

// Displays a post (GET request, /)
module.exports.readPost = (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log('Failure to get data :' + err)
        }
    }).sort({createdAt: -1});
}

// Creates a post, needs posterId, message, video, likers and comments as required parameters (POST request, /)
module.exports.createPost = async (req, res) => {
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
module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log("Update error" + err);
            }
        }
    )
}

// Deletes the whole post (DELETE request, /:id (id of the post))
module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            console.log("Delete error : " + err);
        }
    });
};

// Allows the user to like a post, and populates both the likers array of the post, and the likes array of the user. (PATCH request, /like-post/:id)
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: { likers: req.body.id },
        },
        { new: true },
        (err, docs) => {
          if (err) {
            return res.status(400).send(err);
          } 
        }
      );
      await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $addToSet: { likes: req.params.id },
        },
        { new: true },
        (err, docs) => {
          if (!err) {
            res.send(docs); 
          } 
          else {
              return res.status(400).send(err);
          }
        }
      );
    } catch (err) {
      return res.status(400).send(err);
    }
  };

  // Allows the user to unlike a post, and removes both in the likers array of the post, and in the likes array of the user. (PATCH request, /unlike-post/:id)
module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        await PostModel.findByIdAndUpdate(
          req.params.id,
          {
            $pull: { likers: req.body.id },
          },
          { new: true },
          (err, docs) => {
            if (err) {
              return res.status(400).send(err);
            } 
          }
        );
        await UserModel.findByIdAndUpdate(
          req.body.id,
          {
            $pull: { likes: req.params.id },
          },
          { new: true },
          (err, docs) => {
            if (!err) {
              res.send(docs); 
            } 
            else {
                return res.status(400).send(err);
            }
          }
        );
      } catch (err) {
        return res.status(400).send(err);
      }
}

// Allows the users to comment posts, pushes a comments object into the post so the comment is added without altering the previous comments. (PATCH request, /comment-post/:id)
module.exports.commentPost = (req,res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    },
                },
            },
            {new:true},
            (err,docs) => {
                if (!err) {
                    res.send(docs)
                } else {
                    return res.status(400).send(err);
                }
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};

// Allows the user to edit a comment, iterates through the comments array to find the matching comment _id and updates the comment body. (PATCH request, /edit-comment-post/:id)
module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID unknown : " + req.params.id);
  
    try {
      return PostModel.findById(req.params.id, (err, docs) => {
        const theComment = docs.comments.find((comment) =>
          comment._id.equals(req.body.commentId)
        );
  
        if (!theComment) {
            return res.status(404).send("Comment not found");
        } 
        theComment.text = req.body.text;
  
        return docs.save((err) => {
          if (!err) {
            return res.status(200).send(docs);  
          } 
          return res.status(500).send(err);
        });
      });
    } catch (err) {
      return res.status(400).send(err);
    }
  };

// Iterates through the comments array from the post and removes the comment matching with the _id. (PATCH request, /delete-comment-post/:id)
module.exports.deleteCommentPost = (req,res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send("ID unknown : " + req.params.id);
    }

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentId,
                    },
                },
            },
            {new: true},
            (err,docs) => {
                if (!err) {
                    return res.send(docs);
                } else {
                    return res.status(400).send(err);
                }
            }
        );
    } catch (err) {
        return res.status(400).send(err);
    }
};