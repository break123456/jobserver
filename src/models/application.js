const mongoose = require('mongoose') 

const ApplicationSchema = new mongoose.Schema(
  {
    userId: { //user id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student'
    },
    postId: { //post id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    state :{
      type : String,
      enum : ["pending", "rejected", "nointerst", "shortlist", "hired" ],
      default: "pending"
    },
    answers : [String]
  },
  {
    timestamps: true,
  }
);
const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
