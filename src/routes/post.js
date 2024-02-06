const express = require('express');
const post = require('../controllers/post');
const {checkStudentLoggedIn} = require('../middleware/authorization')

const postRouter = express.Router();
postRouter.get('/landing', checkStudentLoggedIn, post.landingPosts);
postRouter.get('/filter', post.filterPost);
postRouter.get('/:id', checkStudentLoggedIn, post.getPost);

module.exports = postRouter;