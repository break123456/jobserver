const express = require('express');
const admin = require('../controllers/admin');
const {verifyAdminToken} = require('../middleware/authorization')

const adminRouter = express.Router();
adminRouter.post('/register', admin.adminSignUp);
adminRouter.post('/login', admin.adminLogin);
adminRouter.get('/posts', verifyAdminToken, admin.getPosts);
adminRouter.get('/employers', verifyAdminToken, admin.getEmployers);
adminRouter.get('/employer', verifyAdminToken, admin.getEmployerById);
adminRouter.get('/employer/posts', verifyAdminToken, admin.getEmployerPosts);
adminRouter.patch('/employer/updatestate', verifyAdminToken, admin.updateEmployerState);
adminRouter.patch('/post/updatestate', verifyAdminToken, admin.updatePostState);

module.exports = adminRouter;