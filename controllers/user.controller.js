const userModel = require("../models/user.model");
const objectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req,res) => {
    const users = await userModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = (req, res) => {
    if (!objectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown : ' + req.params.id)
    }

    userModel.findById(req.params.id, (err,docs) => {
        if (!err) {
            res.send(docs)
        } else {
            console.log('ID unknown :' + err)
        }
    }).select('-password');
};