const {Schema, Types, model} = require("mongoose");

function formatDate(createdAt) {
  let ampm = 'am';
  const dateStrArr = new Date(createdAt).toString().split(" ");
  const timeArr = dateStrArr[4].split(":");
  let h = parseInt(timeArr[0]);
  if (h >= 12) {
    ampm = 'pm';
    if (h > 12) {
      h -= 12;
    }
  } else if (h === 0) {
    h = 12;
  }

  return `${dateStrArr[0]} ${dateStrArr[1]} ${dateStrArr[2]}, ${dateStrArr[3]} at ${h}:${timeArr[1]}${ampm}`;
  // console.log(date);
  // return date;
}

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: formatDate,
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
      get: formatDate,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
