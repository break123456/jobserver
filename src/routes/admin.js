const express = require('express');
const admin = require('../controllers/admin');
const {verifyAdminToken} = require('../middleware/authorization')

const adminRouter = express.Router();
adminRouter.post('/register', admin.adminSignUp);
adminRouter.post('/login', admin.adminLogin);
adminRouter.get('/employers', admin.getEmployers);
adminRouter.get('/employer/posts', admin.getEmployerPosts);