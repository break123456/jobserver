const mongoose = require("mongoose");

const chatmsgSchema = new mongoose.Schema(
    {
      message: {
        type: String,
        trim: true,
        required: true,
      },
      user : {
        type: String,
        trim: true,
        required: true,
        enum: ["emp", "stu"]
      }
    },
    { timestamps: true }
);

const chatroomSchema = new mongoose.Schema(
  {
    postId: { //post id
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Post",
    },
    messages: [chatmsgSchema],
    employer: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Employer",
    },
    student: {  
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    status: {
        type: String,
        required: true,
        enum: ["active", "disable"],
        default: "active",
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("ChatRoom", chatroomSchema);
