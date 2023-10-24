const { Student, User } = require("../models/user");
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const {trainingSchema} = require('./../models/schema/student-info')

exports.studentSignUp = async(req, res)=>{
    const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    console.log("sanjany--->")
    const StudentExist = await Student.findOne({ email: email });
    console.log("sanjany--->")
    if (StudentExist) {
        return res.status(422).json({ Error: "Student exist" });
    }
    console.log("sanjany--->")
    const student = new Student(req.body);
    const newStudent = await student.save();
    res.status(200).json({ success: true, Student : newStudent });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.studentSignIn = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "fill proper details" });
        }
        const student = await Student.findOne({ email }).select("+password");
        if (student) {
          const isMatch = await bcrypt.compare(password, student.password);
    
          const token = await student.generateAuthToken();
    
          if (!isMatch) {
            console.log("password not match");
            res.status(400).json({ error: "invailid login details" });
          } else {
            console.log("user is logged in");
            res.status(200).json({ message: "login sucessfull", user : student, token });
          }
        } else {
          res.status(400).json({ error: "Student error" });
        }
    } catch (error) {
      res.status(404).json({message: error.message});
    }
}


exports.getAllStudents = async (req, res)=>{
  try {
    const student = await Student.find({status: true});
    res.status(200).json(student);
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

exports.getStudentById = async (req, res)=>{
  try {
    const student = await Student.findById(req.params.id);
    if(student ){
      res.status(200).json(student);
    }else{
      res.status(404).json({success : false, message : "Student not found"})
    }
  } catch (error) {
    res.status(404).json({message: error.message});
  }
  

}

exports.deleteStudentById = async (req, res)=>{
  try {
    const id = req.params.id;
    const student = await Student.findByIdAndUpdate(id, {status : false} );
    console.log(student);
    res.status(200).json({ success: true, message : "student deleted successfully"});
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}


exports.updateStudentbyId = async (req, res)=>{
    try {
        const id = req.params.id;
        console.log(id);
        const body = req.body;
        const newStudent = await Student.findByIdAndUpdate(id, body);
        console.log(newStudent);
        if(newStudent){
            res.status(200).json({sucess : true, messsage : "student updated successfully...!"});
        }else{
            res.status(200).json({sucess : false, messsage : "some error occured while updating student"});
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.getStudentPreferenceById = async (req, res)=>{
    try {
        const id = req.params.id;
        const myPref = await Student.findById(id);
        console.log(myPref);
        if(myPref){
            res.status(200).json({sucess : true, preferences : myPref.preferences, workMode : myPref.workMode});
        }else{
            res.status(200).json({sucess : false, messsage : "some error occured.."});
        }
    } catch (error) {
        res.status(404).json({message: error.message});
    }

}

exports.addTraining = async(req,res) => {
  try {
    const { id, title, company, workMode, startDate, endDate, description } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    let entry = {
      title: title,
      company,
      workMode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description
    };
    //await entry.save();
    student.training.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Training added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}


exports.addExperience = async(req,res) => {
  try {
    const { id, profile, company, workMode, startDate, endDate, description } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    let entry = {
      profile: profile,
      company,
      workMode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description
    };
    //await entry.save();
    student.experience.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Experience added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.addEducation = async(req,res) => {
  try {
    const { id, school, percentage, startDate, endDate, degreeType } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    let entry = {
      school,
      percentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      degreeType
    };
    //await entry.save();
    student.education.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Education added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}