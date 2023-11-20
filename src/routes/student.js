const express = require('express');
const student= require('../controllers/student');
const {verifyStudentToken} = require('../middleware/authorization')

const studentRouter = express.Router();
studentRouter.post('/register', student.studentSignUp);
studentRouter.post('/login', student.studentSignIn);

studentRouter.get('/allstudents', student.getAllStudents);
studentRouter.patch('/:id', verifyStudentToken, student.updateStudentbyId);
studentRouter.get('/:id', verifyStudentToken, student.getStudentById);
studentRouter.delete('/:id', verifyStudentToken, student.deleteStudentById);

studentRouter.get('/preferences/:id', student.getStudentPreferenceById)

studentRouter.post('/training/add', verifyStudentToken, student.addTraining)
studentRouter.get('/training/all', verifyStudentToken, student.getTrainingAll)
studentRouter.get('/training/get', verifyStudentToken, student.getTraining)
studentRouter.post('/experience/add', verifyStudentToken, student.addExperience)
studentRouter.get('/experience/all', verifyStudentToken, student.getExperienceAll)
studentRouter.get('/experience/get', verifyStudentToken, student.getExperience)
studentRouter.post('/education/add', verifyStudentToken, student.addEducation)
studentRouter.get('/education/all', verifyStudentToken, student.getEducationAll)
studentRouter.get('/education/get', verifyStudentToken, student.getEducation)
studentRouter.post('/skill/add', verifyStudentToken, student.addSkill)
studentRouter.post('/project/add', verifyStudentToken, student.addProject)
studentRouter.post('/additional/add', verifyStudentToken, student.addAdditional) //extra accomplishment, extra curriculum 
studentRouter.post('/preference/add', verifyStudentToken, student.addPreference)
studentRouter.post('/post/apply', verifyStudentToken, student.applyPost)

module.exports = studentRouter;