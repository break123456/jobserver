const express = require('express')
const chatroom = require('../controllers/chatroom')
const chatroomRouter = express.Router();

chatroomRouter.get('/list', chatroom.listRooms);
//chatroomRouter.post('/add', chatroom.addChatroom);
//chatroomRouter.get('/messages', chatroom.getMessages);
//chatroomRouter.post('/message/add', chatroom.addMessage);

module.exports = chatroomRouter;