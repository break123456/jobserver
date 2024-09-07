const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    empId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Employer',
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'active', 'disabled'], //pending to active if employer send first message
      default: 'active',
    },
  },
  { timestamps: true }
);

const Chatroom = mongoose.model('Chatroom', chatroomSchema);
module.exports = Chatroom;
