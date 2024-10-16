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
    coverLetter: {
      type: String,
      trim: true
    },
    availability: { //if no, store reason only
      type: String,
      trim: true
    },
    state :{
      type : String,
      enum : ["pending", "rejected", "shortlist", "hired" ],
      default: "pending"
    },
    answers : [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true,
  }
);
const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
