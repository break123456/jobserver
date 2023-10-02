const express = require('express');
const { employerSignUp, employerLogin } = require('../controllers/employer');

const employeeRouter = express.Router();
employeeRouter.post('/register', employerSignUp);
employeeRouter.post('/login', employerLogin);


module.exports = employeeRouter;