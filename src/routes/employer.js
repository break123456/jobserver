const express = require('express');
const { employerSignUp, employerLogin, addPost, filterPost, getPost } = require('../controllers/employer');

const employeeRouter = express.Router();
employeeRouter.post('/register', employerSignUp);
employeeRouter.post('/login', employerLogin);
employeeRouter.post('/post/add', addPost);
employeeRouter.get('/post/filter', filterPost);
employeeRouter.get('/post/:id', getPost);


module.exports = employeeRouter;