const Chatroom = require('./../models/chatroom')


const listRooms = async(req, res) => {
    const { postId } = req.body;

    try {
        const postData = await Post.findById(postId);
        if(!postData) {
            return res.status(404).json({ msg: 'Invalid post' });
        }

        const rooms = await Chatroom.find({postId: postId});
  
      const savedChatroom = await newChatroom.save();
      res.status(201).json(savedChatroom);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

// Add a new chatroom
const addChatroom = async (req, res) => {
  const { postId, empid, studentid } = req.body;

  try {
    const newChatroom = new Chatroom({
      postId,
      empid,
      studentid,
      status: "active"
    });

    const savedChatroom = await newChatroom.save();
    res.status(201).json(savedChatroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a message to a chatroom
const addMessage = async (req, res) => {
  const { chatroomId, message, user } = req.body;

  try {
    const chatroom = await Chatroom.findById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    chatroom.messages.push({ message, user });
    const updatedChatroom = await chatroom.save();

    res.status(200).json(updatedChatroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message from a chatroom
const deleteMessage = async (req, res) => {
  const { chatroomId, messageId } = req.params;

  try {
    const chatroom = await Chatroom.findById(chatroomId);

    if (!chatroom) {
      return res.status(404).json({ error: 'Chatroom not found' });
    }

    chatroom.messages.id(messageId).remove();
    const updatedChatroom = await chatroom.save();

    res.status(200).json(updatedChatroom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addChatroom,
  addMessage,
  deleteMessage
};
