const express = require('express')
const user = require('../controllers/user-controller');

const userRouter = express.Router();

userRouter.post('/register', user.userSignup);
userRouter.post('/login', user.userLogin);
userRouter.put('/:id', user.updateUser);
userRouter.delete('/:id', user.deleteUser);

module.exports = userRouter;