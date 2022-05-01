// ObjectId() method for converting studentId string into an ObjectId for querying database
const {ObjectId} = require("mongoose").Types;
const {User, Thought} = require("../models");

// TODO: Create an aggregate function to get the number of students overall
const totalUsers = async () =>
  User.aggregate([{$count: "numberOfUsers"}])
    // Your code here
    .then((numberOfUsers) => numberOfUsers);

// Execute the aggregate method on the Student model and calculate the overall grade by using the $avg operator
const grade = async (studentId) =>
  Student.aggregate(
    [
      // TODO: Ensure we include only the student who can match the given ObjectId using the $match operator
      {
        // Your code here
        $match: {_id: ObjectId(studentId)},
      },
      {
        $unwind: "$assignments",
      },
      // TODO: Group information for the student with the given ObjectId alongside an overall grade calculated using the $avg operator
      {
        // Your code here
        $group: {
          _id: ObjectId(studentId),
          overallGrade: {$avg: "$assignments.score"},
        },
      },
    ],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        return result;
      }
    }
  );

module.exports = {
  // Get all students
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
  // Get a single student
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
  // create a new student
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({_id: req.params.userId})
      .then((user) =>
        !user
          ? res.status(404).json({message: "No such user exists"})
          : Thought.findAll(
              {username: user.username},
            ).remove().exec()
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

  // Add an assignment to a student
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
  // Remove assignment from a student
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
