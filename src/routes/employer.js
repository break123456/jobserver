const express = require('express');
const employer = require('../controllers/employer');
const chatroom = require('../controllers/chatroom');
const {verifyEmployerToken} = require('../middleware/authorization')

const employeeRouter = express.Router();
employeeRouter.post('/register', employer.employerSignUp);
employeeRouter.post('/login', employer.employerLogin);
employeeRouter.get('/details', verifyEmployerToken, employer.employerDetails);
employeeRouter.get('/chatroom/list', verifyEmployerToken, chatroom.getEmployerChatRooms);
employeeRouter.post('/chatroom/add', verifyEmployerToken, chatroom.addChatroom);
employeeRouter.get('/chatroom/messages', verifyEmployerToken, chatroom.getChatRoomMessagesForEmployer);
employeeRouter.post('/chatroom/message/add', verifyEmployerToken, chatroom.addMessageByEmployer);
employeeRouter.patch('/company/update', verifyEmployerToken, employer.updateCompanyDetails);
employeeRouter.post('/post/add', verifyEmployerToken, employer.addPost);
employeeRouter.patch('/post/application/state', verifyEmployerToken, employer.updateApplicationState);
employeeRouter.get('/post/applications', verifyEmployerToken, employer.getPostApplications);
employeeRouter.get('/post/applications-status', verifyEmployerToken, employer.getPostApplicationsStatus);
employeeRouter.get('/posts', verifyEmployerToken, employer.getPosts);
employeeRouter.get('/chat/posts', verifyEmployerToken, employer.getPostListForChat);
employeeRouter.get('/chat/applicants', verifyEmployerToken, employer.getPostApplicantsForChat);
employeeRouter.get('/chat/rooms', verifyEmployerToken, employer.getActiveChatRooms);
employeeRouter.get('/chat/room', verifyEmployerToken, employer.getChatRoom);
employeeRouter.get('/chat/student', verifyEmployerToken, employer.getRoomStudent);
employeeRouter.get('/chat/messages', verifyEmployerToken, employer.getRoomMessages);
employeeRouter.post('/verify-domain', verifyEmployerToken, employer.verifyDomain);
employeeRouter.get('/:id', verifyEmployerToken, employer.getStudentById);

module.exports = employeeRouter;