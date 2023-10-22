const { Employer } = require("../models/user");
const bcrypt = require('bcryptjs');
const strUtil = require('../helper/string-util')

exports.employerSignUp = async(req, res)=>{
    const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    const employeEmail = await Employer.findOne({ email: email });
    const employeMobile = await Employer.findOne({ mobile: mobile });

    if (employeEmail || employeMobile) {
        return res.status(422).json({ Error: "account exist" });
    }
    const employer = new Employer(req.body);
    const token = await employer.generateAuthToken();
    const newEmployer = await employer.save();

    res.status(200).json({ success: true, message : "your account has been created successfully...", user: newEmployer, token: token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.employerLogin = async(req, res)=>{
    try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "fill proper details" });
        }
        const employee = await Employer.findOne({ email }).select("+password");
        if (employee) {
          const isMatch = await bcrypt.compare(password, employee.password);
    
          const token = await employee.generateAuthToken();
    
          if (!isMatch) {
            console.log("password not match");
            res.status(400).json({ error: "invailid login details" });
          } else {
            console.log("user is logged in");
            res.status(200).json({ message: "login sucessfull", user : employee, token });
          }
        } else {
          res.status(400).json({ error: "user not found" });
        }
    } catch (error) {    
      res.status(404).json({message: error.message});
    }
}

exports.postJob = async(req, res) => {
    try {
      const { title, skills, workModel, workTime, numOpening, duration, startDate, responsiblity, stipend } = req.body;
      const newPost = new Post({
          title,
          slug: strUtil.createSlug(title),
          skills,
          workModel,
          workTime,
          numOpening,
          duration,
          startDate,
          responsiblity,
          stipend
      });
      await newPost.save();  
      res.status(200).send({msg:"Post added successfully"})
    } catch (error) {
        console.log("error: ", error);
        res.status(401).send("Post addition failed")
    }   
}