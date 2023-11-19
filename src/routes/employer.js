const express = require('express');
const { employerSignUp, employerLogin, addPost, filterPost, getPost, verifyDomain } = require('../controllers/employer');

const employeeRouter = express.Router();
employeeRouter.post('/register', employerSignUp);
employeeRouter.post('/login', employerLogin);
employeeRouter.post('/post/add', addPost);
employeeRouter.post('/verify-domain', verifyDomain);


module.exports = employeeRouter;