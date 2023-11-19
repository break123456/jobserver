const express = require('express');
const post = require('../controllers/post');

const postRouter = express.Router();
postRouter.get('/filter', post.filterPost);
postRouter.get('/:id', post.getPost);
postRouter.get('/:id', post.getPost);

module.exports = postRouter;