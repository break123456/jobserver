const express = require('express');
const { employerSignUp, employerLogin, postJob } = require('../controllers/employer');

const employeeRouter = express.Router();
employeeRouter.post('/register', employerSignUp);
employeeRouter.post('/login', employerLogin);
employeeRouter.post('/job-post', postJob);


module.exports = employeeRouter;