const express = require('express');
const student= require('../controllers/student');
const {verifyStudentToken} = require('../middleware/authorization')

const studentRouter = express.Router();
studentRouter.post('/register', student.studentSignUp);
studentRouter.post('/login', student.studentSignIn);
studentRouter.get('/details', verifyStudentToken, student.getDetails);

//studentRouter.get('/allstudents', student.getAllStudents);
studentRouter.patch('/:id', verifyStudentToken, student.updateStudentbyId);
studentRouter.delete('/:id', verifyStudentToken, student.deleteStudentById);

studentRouter.get('/preferences/:id', student.getStudentPreferenceById)

studentRouter.post('/training/add', verifyStudentToken, student.addTraining)
studentRouter.put('/training/:id', verifyStudentToken, student.editTraining)
studentRouter.delete('/training/:id', verifyStudentToken, student.deleteTraining)
studentRouter.get('/training/all', verifyStudentToken, student.getTrainingAll)
studentRouter.get('/training/get', verifyStudentToken, student.getTraining)
studentRouter.post('/experience/add', verifyStudentToken, student.addExperience)
studentRouter.put('/experience/:id', verifyStudentToken, student.editExperience)
studentRouter.delete('/experience/:id', verifyStudentToken, student.deleteExperience)
studentRouter.get('/experience/all', verifyStudentToken, student.getExperienceAll)
studentRouter.get('/experience/get', verifyStudentToken, student.getExperience)
studentRouter.post('/education/add', verifyStudentToken, student.addEducation)
studentRouter.get('/education/all', verifyStudentToken, student.getEducationAll)
studentRouter.put('/education/:id', verifyStudentToken, student.editEducation)
studentRouter.delete('/education/:id', verifyStudentToken, student.deleteEducation)
studentRouter.get('/education/get', verifyStudentToken, student.getEducation)
studentRouter.post('/skill/add', verifyStudentToken, student.addSkill)
studentRouter.delete('/skill/del', verifyStudentToken, student.deleteSkill)
studentRouter.post('/project/add', verifyStudentToken, student.addProject)
studentRouter.put('/project/:id', verifyStudentToken, student.editProject)
studentRouter.delete('/project/:id', verifyStudentToken, student.deleteProject)
studentRouter.post('/additional/add', verifyStudentToken, student.addAdditional) //extra accomplishment, extra curriculum 
studentRouter.put('/additional/:id', verifyStudentToken, student.editAdditional)
studentRouter.delete('/additional/:id', verifyStudentToken, student.deleteAdditional)
studentRouter.post('/preference/add', verifyStudentToken, student.addPreference)
studentRouter.delete('/preference/del', verifyStudentToken, student.deletePreference)
studentRouter.post('/post/apply', verifyStudentToken, student.applyPost)
studentRouter.post('/post/unapply', verifyStudentToken, student.unApplyPost)
studentRouter.get('/post/applied', verifyStudentToken, student.allAppliedPosts)

module.exports = studentRouter;