const { Admin, Employer } = require("../models/user");
const Application  = require("../models/application");
const Post = require("../models/post");
const bcrypt = require('bcryptjs');
const strUtil = require('../helper/string-util')
const dns = require('dns');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

exports.adminSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password ) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    const employeEmail = await Admin.findOne({ email: email });

    if (employeEmail) {
      return res.status(422).json({ Error: "account exist" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const admin = new Admin({
      name: name.trim(),
      email: email.trim(),
      password: passwordHash,
      mobile: "9999999999",
      role: 'admin',
      active: 1 //TODO: will change later
    });
    const newAdmin = await admin.save();

    res.status(200).json({ success: true, message: "your account has been created successfully..." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "fill proper details" });
    }
    console.log("email:" +email + " password:" + password);
    const admin = await Admin.findOne({ email }).select("+password");
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        console.log("password not match");
        res.status(400).json({ error: "invailid login details" });
      } else {
        console.log("admin is logged in");
        const token = jwt.sign({ 
          id: admin._id, 
          email: admin.email }, 
          process.env.JWT_SECRET);
        res.status(200).json({ message: "login sucessfull", user: admin, token });
      }
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

exports.adminDetails = async (req, res)=>{
  try {
    const admin = await Admin.findById(req.user.id);
    if(admin ){
      res.status(200).json({success: true, admin : admin});
    }else{
      res.status(404).json({success : false, message : "Admin not found"})
    }
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

exports.getEmployers = async(req, res) => {
    try {
        let {state} = req.query;
        let employers = [];
        if(state == undefined || state == "all")
        {
          employers = await Employer.find({});
        } 
        else 
          employers = await Employer.find({status: state});
            
        return res.status(200).json({success: true, employers : employers});
      } catch (error) {
        return res.status(404).json({message: error.message});
    }
}

exports.updateEmployerState = async(req, res) => {
  try {
      const { empid, status, reason } = req.body;
      const employer = await Employer.findById(empid);
      if(!employer)
      {
          return res.status(401).json({ error: error.message, msg: "Invalid employer request" });
      }
      employer.status = status;
      if(reason != undefined)
        employer.reason = reason;
      await employer.save();
      return res.status(200).send({msg: "success" })
  } catch (error) {
      console.log("error: ", error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(401).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }
}

exports.getEmployerPosts = async(req, res) => {
    try {
        const { empid, state } = req.query;
        let posts = [] ;
        if(state == undefined || state == "all") {
          posts = await Post.find({ ownerId: empid });
        } else {
          posts = await Post.find({ ownerId: empid, status: state });
        }
        return res.status(200).send({ posts: posts, msg: "success" })
    } catch (error) {
        console.log("error: ", error);
        return res.status(401).json({ error: error.message, msg: "Employer post filter failed" })
    }
}

exports.updatePostState = async(req, res) => {
    try {
        const { empid, postid, status, reason } = req.body;
        const post = await Post.findById(postid);
        if(!post || (post.ownerId != empid))
        {
            return res.status(401).json({ error: error.message, msg: "Invalid post request" });
        }
        post.status = status;
        if(reason != undefined && reason != "")
          post.reason = reason;
        await post.save();
        return res.status(200).send({msg: "success" })
    } catch (error) {
        console.log("error: ", error);
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(401).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

// Function to query TXT records for a domain using DNS
function queryTxtRecords(domain) {
  return new Promise((resolve, reject) => {
    dns.resolveTxt(domain, (err, records) => {
      if (err) {
        reject(err);
      } else {
        // Flatten the array of arrays returned by dns.resolveTxt
        const flattenedRecords = records.flat();
        resolve(flattenedRecords);
      }
    });
  });
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
//get posts by this admin
exports.getPosts = async (req, res)=>{
  try {
    const { id } = req.user.id;
    let posts = await Post.find({ ownerId: id });
    res.status(200).send({ posts: posts, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post filter failed" })
  }
}

exports.getPostApplications = async (req, res)=>{
  try {
    const id = req.user.id;
    const { postid } = req.query;
    let students = [];
    let {state} = req.query;
    if(state == undefined)
        state = "all";
    if(state != "all" && state != "pending" &&
        state != "rejected" && state != "shortlist" && 
        state != "hired" && state != "nointerst")
        return res.status(401).send({ msg: "invalid query" })
    if(state == "all")
    {
      students = await Application.find({ postId: postid })
                    .populate('userId').exec();
    }
    else {
      students = await Application.find({ postId: postid, state: state })
      .populate('userId').exec();
    }
    //.populate({ path: 'userId', select: 'name education'}).exec();
    return res.status(200).send({ students: students, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Post applications get failed" })
  }
}

exports.verifyDomain = async(req, res) => {
  const { domain, token } = req.body;

  try {
    // Use DNS to query the TXT records for the specified domain
    //const txtRecords = await queryTxtRecords(domain);
    let txtRecords =  [];
    dns.resolveTxt(domain, (err,  txtRecords) =>  {
      if(err) {
        console.log('TXT records failed: ' + err.message); 
        return res.status(500).json({error: error.message});
      } else {
          console.log('TXT records: '+  txtRecords.flat()); 
      }
    });
      

    // Check if the token is found in the TXT records
    // (txtRecords.includes(token) && token === txtRecords.flat()) 
    if (txtRecords.includes(token)) {
      res.status(200).send('Domain ownership verified successfully');
    } else {
      res.status(403).send('Domain ownership verification failed');
    }
  } catch (error) {
    console.error('Error verifying domain:', error);
    res.status(500).send('Internal Server Error');
  }
}
