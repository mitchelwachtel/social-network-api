const {Schema, model, isEmail} = require("mongoose");
const {Thought} = require("./Thought");

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      tim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // validate: [isEmail, "invalid email"],
    },
    thoughts: [{type: Schema.Types.ObjectId, ref: "Thought"}],
    friends: [{type: Schema.Types.ObjectId, ref: this}],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("user", userSchema);

module.exports = User;
