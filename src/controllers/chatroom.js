const Chatroom = require('./../models/chatroom')
const Message = require('../models/chatmsg');

exports.getEmployerChatRooms = async (req, res) => {
  const { postId } = req.query;
  const id = req.user.id;
  try {
    let rooms = [];
    if(postId == undefined)
      rooms = await Chatroom.find({ empId: id });
    else {
      const postData = await Post.findById(postId);
      if (!postData) {
        return res.status(404).json({ msg: 'Invalid post' });
      }
      rooms = await Chatroom.find({ postId: postId, empId: id });
    }
    res.status(200).json({"rooms": rooms});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add a new chatroom ( only employer allowed)
exports.addChatroom = async (req, res) => {
  const { postId, studentid } = req.body;
  const empid = req.user.id;

  try {
    //TODO: Verify studentid, postid
    //check if already exist
    const chatRoom = await Chatroom.findOne({empId: empid, studentId: studentid});
    if(chatRoom) {
      return res.status(200).json({room: savedChatroom, msg: "already exist"});
    }
    const newChatroom = new Chatroom({
      postId,
      empId:empid,
      studentId:studentid,
      status: 'active',
    });

    const savedChatroom = await newChatroom.save();
    return res.status(200).json({room: savedChatroom});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a message to a chatroom
exports.addMessageByEmployer = async (req, res) => {
  const { chatroomId, message } = req.body;
  const empid = req.user.id;

  try {
    //can't write on any chatroom
    const chatroom = await Chatroom.findOne({_id: chatroomId, empId: empid});

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    const newMessage = new Message({ chatroomId, message, user: "emp" });
    const savedMessage = await newMessage.save();

    res.status(200).json({msg: "success", msdId: savedMessage._id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//get messages for employer
exports.getChatRoomMessagesForEmployer = async (req, res) => {
  const { chatroomId } = req.query;
  const empid = req.user.id;

  try {
    //can't write on any chatroom
    const chatroom = await Chatroom.findOne({_id: chatroomId, empId: empid});

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    const messages = await Message.find({chatroomId: chatroomId});
    return  res.status(200).json({msg: "success", messages: messages});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//get messages for employer
exports.getChatRoomMessagesForStudent = async (req, res) => {
  const { chatroomId } = req.body;
  const empid = req.user.id;

  try {
    //can't write on any chatroom
    const chatroom = await Chatroom.findOne({_id: chatroomId, studentId: empid});

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    const messages = Message.find({chatroomId: chatroomId});
    return  res.status(200).json({msg: "success", messages: messages});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message from a chatroom
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

