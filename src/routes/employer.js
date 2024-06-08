const express = require('express');
const employer = require('../controllers/employer');
const {verifyEmployerToken} = require('../middleware/authorization')

const employeeRouter = express.Router();
employeeRouter.post('/register', employer.employerSignUp);
employeeRouter.post('/login', employer.employerLogin);
employeeRouter.get('/details', verifyEmployerToken, employer.employerDetails);
employeeRouter.patch('/company/update', verifyEmployerToken, employer.updateCompanyDetails);
employeeRouter.post('/post/add', verifyEmployerToken, employer.addPost);
employeeRouter.patch('/post/application/state', verifyEmployerToken, employer.updateApplicationState);
employeeRouter.get('/post/applications', verifyEmployerToken, employer.getPostApplications);
employeeRouter.get('/posts', verifyEmployerToken, employer.getPosts);
employeeRouter.post('/verify-domain', verifyEmployerToken, employer.verifyDomain);
employeeRouter.get('/:id', verifyEmployerToken, employer.getStudentById);

module.exports = employeeRouter;