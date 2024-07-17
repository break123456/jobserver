const mongoose = require('mongoose');

const chatMsgSchema = new mongoose.Schema(
  {
    chatroomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chatroom',
    },
    message: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: String,
      trim: true,
      required: true,
      enum: ['emp', 'stu'],
    },
  },
  { timestamps: true }
);

const ChatMsg = mongoose.model('ChatMsg', chatMsgSchema);
module.exports = ChatMsg;
