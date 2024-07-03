const { Employer } = require("../models/user");
const Application  = require("../models/application");
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
      status: "pending",
      active: 0 //TODO: will change later
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
        //check status
        if(employer.status == "pending") {
          return res.status(202).json({ message: "Account is not active"});
        }
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
    const { postId, title, skills, locations, workType, numOpening, duration, startDate, responsibility, stipend, perksState, ppo, questions, mobile } = req.body;
    let postSkills = [];
    let postLocs = [];
    skills.forEach((item) => {
      postSkills.push(item.name);
    });
    locations.forEach((item) => {
      postLocs.push(item.name);
    });
    if (postId === "new") {
      const newPost = new Post({
        title,
        slug: strUtil.createSlug(title),
        skills: postSkills,
        workModel: workType,
        numOpening,
        duration,
        startDate: new Date(startDate),
        responsibility,
        stipend,
        locations: postLocs,
        questions: questions,
        mobile,
        perks: perksState,
        ppo,
        ownerId: id
      });
      newPost.isApproved = true;
      await newPost.save();
    } else {
      await Post.findByIdAndUpdate(postId, {
        title,
        slug: strUtil.createSlug(title),
        skills: postSkills,
        workModel: workType,
        numOpening,
        duration,
        startDate: new Date(startDate),
        responsibility,
        stipend,
        locations: postLocs,
        questions: questions,
        mobile,
        perks: perksState,
        ppo,
        ownerId: id
      });
    }
    let msg = "Post added successfully";
    if (postId !== "new") {
      msg = "Post udpated successfullly";
    }
    return res.status(200).send({ msg: msg })
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
    const { id } = req.user;
    const { state } = req.query;
    console.log("getposts:" + state);
    let posts = [];
    if(state == undefined) {
      posts = await Post.find({ ownerId: id }).select('title stats status').sort({ updatedAt: -1 });
    } else {
      posts = await Post.find({ ownerId: id, status: state }).select('title stats status').sort({ updatedAt: -1 });
    }
    res.status(200).send({ posts: posts, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post list failed" })
  }
}

// Update the state of an application
exports.updateApplicationState =  async (req, res) => {
  try {
      const { id, state } = req.body;
      // Validate that the state is one of the allowed values
      const allowedStates = ["pending", "rejected", "nointerest", "shortlist", "hired"];
      if (!allowedStates.includes(state)) {
          return res.status(400).json({ error: 'Invalid state value' });
      }

      const application = await Application.findByIdAndUpdate(
          id,
          { state },
          { new: true } // Return the updated document
      );

      if (!application) {
          return res.status(404).json({ error: 'Application not found' });
      }

      res.status(200).json({msg: "success"});
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.getPostApplications = async (req, res)=>{
  try {
    console.log("called getPostApplications");
    const id = req.user.id;
    const { postid, state } = req.query;
    let applications = [];
    const post = await Post.findById(postid);
    if(!post) {
      res.status(202).send({ msg: "Invalid post" })
    }
    if(state == undefined)
        state = "all";
    if(state != "all" && state != "pending" &&
        state != "rejected" && state != "shortlist" && 
        state != "hired" && state != "nointerest")
        return res.status(401).send({ msg: "invalid query" })
    if(state == "all")
    {
      applications = await Application.find({ postId: postid })
                    .populate('userId').exec();
    }
    else {
      applications = await Application.find({ postId: postid, state: state })
      .populate('userId').exec();
    }

    //.populate({ path: 'userId', select: 'name education'}).exec();
    return res.status(200).send({ post: post, applications: applications, msg: "success" })
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
