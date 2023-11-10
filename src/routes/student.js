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
studentRouter.get('/experience/all', student.getExperienceAll)
studentRouter.get('/experience/get', student.getExperience)
studentRouter.post('/education/add', student.addEducation)
studentRouter.get('/education/all', student.getEducationAll)
studentRouter.get('/education/get', student.getEducation)
studentRouter.post('/skill/add', student.addSkill)
studentRouter.post('/project/add', student.addProject)
studentRouter.post('/additional/add', student.addAdditional) //extra accomplishment, extra curriculum 
studentRouter.post('/preference/add', student.addPreference)
studentRouter.post('/post/apply', student.applyPost)

module.exports = studentRouter;