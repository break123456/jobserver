const mongoose = require('mongoose');

const chatMsgSchema = new mongoose.Schema(
  {
    chatroomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Chatroom',
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    type: { 
      type: String, enum: ['assignment', 'chat'], 
      required: true 
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    status: { 
      type: String, 
      enum: ['sent', 'delivered', 'read'], 
      default: 'sent' 
    },
    deliveredAt: {
      type: Date,
      default: null // Only set when message is delivered
    },
    readAt: {
      type: Date,
      default: null // Only set when message is read
    }
    
  },
  { timestamps: true }
);
chatMsgSchema.index({ chatroomId: 1, createdAt: 1 });
const ChatMsg = mongoose.model('ChatMsg', chatMsgSchema);
module.exports = ChatMsg;
