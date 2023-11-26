const { Employer } = require("../models/user");
const Post = require("../models/post");
const bcrypt = require('bcryptjs');
const strUtil = require('../helper/string-util')
const dns = require('dns');
const jwt = require('jsonwebtoken')

exports.employerSignUp = async (req, res) => {
  const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    const employeEmail = await Employer.findOne({ email: email });
    const employeMobile = await Employer.findOne({ mobile: mobile });

    if (employeEmail) {
      return res.status(422).json({ Error: "account exist" });
    }
    if (employeMobile) {
      return res.status(422).json({ Error: "mobile already exist" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const employer = new Employer({
      name: name.trim(),
      email: email.trim(),
      password: passwordHash,
      mobile: mobile,
      role: 'employer',
      active: 1 //TODO: will change later
    });
    const newEmployer = await employer.save();

    res.status(200).json({ success: true, message: "your account has been created successfully..." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

exports.employerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "fill proper details" });
    }
    console.log("email:" +email + " password:" + password);
    const employer = await Employer.findOne({ email }).select("+password");
    if (employer) {
      const isMatch = await bcrypt.compare(password, employer.password);
      if (!isMatch) {
        console.log("password not match");
        res.status(400).json({ error: "invailid login details" });
      } else {
        console.log("employer is logged in");
        const token = jwt.sign({ 
          id: employer._id, 
          email: employer.email }, 
          process.env.JWT_SECRET);
        res.status(200).json({ message: "login sucessfull", user: employer, token });
      }
    } else {
      res.status(400).json({ error: "user not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

exports.employerDetails = async (req, res)=>{
  try {
    const employer = await Employer.findById(req.user.id);
    if(employer ){
      res.status(200).json({success: true, employer : employer});
    }else{
      res.status(404).json({success : false, message : "Student not found"})
    }
  } catch (error) {
    res.status(404).json({message: error.message});
  }
}

exports.updateCompanyDetails = async (req, res)=>{
  try {
      const id = req.user.id;
      console.log(id);
      const employer = await Employer.findById(id);
      if(!employer ){
        return res.status(404).json({success : false, message : "Employer not found"})
      }
      const {name, details, numEmployee, address, industry, url} = req.body;
      
      if(employer.isApproved) 
      {
        name = employer.company.name;
        url = employer.company.domain.url;
      }
      employer.company = {
        details: details,
        numEmployee : numEmployee,
        address : address,
        industry: industry,
        name: name,
        slug: strUtil.createSlug(name),
        domain: {
          url : url
        }
      };
      await employer.save();
      return res.status(200).json({sucess : true, messsage : "Company data updated successfully!"});
  } catch (error) {
      res.status(404).json({message: error.message});
  }
}

exports.addPost = async (req, res) => {
  try {
    const id = req.user.id;
    const { title, skills, workModel, workTime, numOpening, duration, startDate, responsiblity, stipend, locations } = req.body;
    const newPost = new Post({
      title,
      slug: strUtil.createSlug(title),
      skills,
      workModel,
      workTime,
      numOpening,
      duration,
      startDate: new Date(startDate),
      responsiblity,
      stipend,
      locations,
      ownerId: id
    });
    newPost.isApproved = true;
    await newPost.save();
    res.status(200).send({ msg: "Post added successfully" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post addition failed" })
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
//get posts by this employer
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
