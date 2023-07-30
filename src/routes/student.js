const express = require('express');
const { updateStudentbyId, getStudentById, deleteStudentById, studentSignUp, studentSignIn, getStudentPreferenceById, getAllStudents } = require('../controllers/student');

const studentRouter = express.Router();
studentRouter.post('/register', studentSignUp);
studentRouter.post('/login', studentSignIn);

studentRouter.get('/allstudents', getAllStudents);
studentRouter.patch('/:id', updateStudentbyId);
studentRouter.get('/:id', getStudentById);
studentRouter.delete('/:id', deleteStudentById);

studentRouter.get('/preferences/:id', getStudentPreferenceById)

module.exports = studentRouter;