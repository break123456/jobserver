const { Student, User } = require("../models/user");
const bcrypt = require('bcryptjs');

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
    console.log(error);
    }
}

exports.addStudent = async (req, res) => {
    try {
        const body = req.body;
        const student = new Student(body);
        const newStudent = await student.save();
        res.status(200).josn({success : true, message : "Student added successfully"});
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message, success : false});
    }
}

exports.getStudentById = async (req, res)=>{
    const student = await Student.findOne(req.params.id);
    res.status(200).json(student);
}

exports.deleteStudentById = async (req, res)=>{
    const id = req.params.id;
    const student = await Student.findByIdAndUpdate(id, {status : false} );
    res.status(200).json({ success: true, message : "student deleted successfully"});
}

exports.updateStudentbyId = async (req, res)=>{
    try {
        const _id = req.params.id;
        console.log(_id);
        const body = req.body;
        const newStudent = await User.create(body);
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