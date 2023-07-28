const express = require('express');
const { updateStudentbyId, getStudentById, deleteStudentById, addStudent, studentSignUp, studentSignIn } = require('../controllers/student');

const studentRouter = express.Router();
studentRouter.post('/register', studentSignUp);
studentRouter.post('/login', studentSignIn);
studentRouter.post('/', addStudent);
studentRouter.put('/:id', updateStudentbyId);
studentRouter.get('/:id', getStudentById);
studentRouter.delete('/:id', deleteStudentById);

module.exports = studentRouter;