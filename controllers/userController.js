const {ObjectId} = require("mongoose").Types;
const {User, Thought} = require("../models");

// Aggregate function to get the number of users overall
const totalUsers = async () =>
  User.aggregate([{$count: "numberOfUsers"}])
    // Your code here
    .then((numberOfUsers) => numberOfUsers);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (students) => {
        const userObj = {
          users,
          headCount: await totalUsers(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({_id: req.params.userId})
      .populate("friends")
      .populate("thoughts")
      .then((user) =>
        !user
          ? res.status(404).json({message: "No post with that ID"})
          : res.json(post)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove associated thoughts
  deleteUser(req, res) {
    User.findOneAndRemove({_id: req.params.userId})
      .then((user) =>
        !user
          ? res.status(404).json({message: "No such user exists"})
          : Thought.findAll({username: user.username}).remove().exec()
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
              message: "User deleted, but no thoughts found",
            })
          : res.json({message: "User successfully deleted"})
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a friend to a user
  addFriend(req, res) {
    console.log("You are adding an friend");
    console.log(req.body);
    User.findOneAndUpdate(
      {_id: req.params.userId},
      {$addToSet: {friends: req.body}},
      {runValidators: true, new: true}
    )
      .then((user) =>
        !user
          ? res.status(404).json({message: "No user found with that ID"})
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove a friend from a user
  removeFriend(req, res) {
    User.findOneAndUpdate(
      {_id: req.params.userId},
      {$pull: {friends: {_id: req.params.friendId}}},
      {runValidators: true, new: true}
    )
      .then((user) =>
        !user
          ? res.status(404).json({message: "No user found with that ID"})
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
