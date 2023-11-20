const express = require('express');
const { employerSignUp, employerLogin, addPost, filterPost, getPost, verifyDomain } = require('../controllers/employer');
const {verifyEmployerToken} = require('../middleware/authorization')

const employeeRouter = express.Router();
employeeRouter.post('/register', employerSignUp);
employeeRouter.post('/login', employerLogin);
employeeRouter.post('/post/add', verifyEmployerToken, addPost);
employeeRouter.post('/verify-domain', verifyEmployerToken, verifyDomain);


module.exports = employeeRouter;