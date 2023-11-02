const express = require('express');
const student= require('../controllers/student');

const studentRouter = express.Router();
studentRouter.post('/register', student.studentSignUp);
studentRouter.post('/login', student.studentSignIn);

studentRouter.get('/allstudents', student.getAllStudents);
studentRouter.patch('/:id', student.updateStudentbyId);
studentRouter.get('/:id', student.getStudentById);
studentRouter.delete('/:id', student.deleteStudentById);

studentRouter.get('/preferences/:id', student.getStudentPreferenceById)

studentRouter.post('/training/add', student.addTraining)
studentRouter.get('/training/all', student.getTrainingAll)
studentRouter.get('/training/get', student.getTraining)
studentRouter.post('/experience/add', student.addExperience)
studentRouter.post('/education/add', student.addEducation)


module.exports = studentRouter;