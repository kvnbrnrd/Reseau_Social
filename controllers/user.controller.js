const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;


// Displays all users (GET request, /)
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

// Displays the user corresponding to the provided ID, minus the password (GET request, /:id)
module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.send(docs);
    } 
    else {
      console.log("ID unknown : " + err);
    } 
  }).select("-password");
};

// Finds the user by id, sets the bio with the content of the request (PUT request, /:id)
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, useFindAndModify: false, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) {
          return res.send(docs);
        } 
        if (err) {
          return res.status(500).send({ message: err });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Finds the user by id, and removes it from the DB (DELETE request, /:id)
module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Finds the user by id in the URL parameter, stores the ID of the user to follow in the body request (PATCH request, /:id)
module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) ||!ObjectID.isValid(req.body.idToFollow)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }


  try {
    // Adds the ID of the user to follow in the "following" array of the user making the request
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { following: req.body.idToFollow } },
      { new: true, upsert: true, useFindAndModify: false },
      (err, docs) => {
        if (!err) {
          res.status(201).json(docs);
        } 
        else {
          return res.status(400).json(err);
        } 
      }
    );
    // Adds the ID of the user who made the follow request to the "followers" array of the user followed
    await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      { $addToSet: { followers: req.params.id } },
      { new: true, upsert: true, useFindAndModify: false },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) {
          return res.status(400).json(err);
        } 
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

// Finds the user by id in the URL parameter, stores the ID of the user to follow in the body request (PATCH request, /:id)
module.exports.unfollow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id) ||!ObjectID.isValid(req.body.idToUnfollow)) {
    return res.status(400).send("ID unknown : " + req.params.id);
  }

  try {
    // Removes the ID of the user to follow in the "following" array of the user making the request
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { following: req.body.idToUnfollow } },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) {
          res.status(201).json(docs);
        } 
        else {
          return res.status(400).json(err);
        } 
      }
    );
    // Removes the ID of the user who made the follow request to the "followers" array of the user previously followed
    await UserModel.findByIdAndUpdate(
      req.body.idToUnfollow,
      { $pull: { followers: req.params.id } },
      { new: true, upsert: true },
      (err, docs) => {
        // if (!err) res.status(201).json(docs);
        if (err) {
          return res.status(400).json(err);
        } 
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};