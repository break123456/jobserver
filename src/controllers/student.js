const { Student, User, Employer } = require("../models/user");
const Application = require('../models/application')
const Post = require('../models/post')
const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');
const {trainingSchema} = require('./../models/schema/student-info')
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.studentSignUp = async(req, res)=>{
    const { name, email, password, mobile } = req.body;
  if (!name || !email || !password || !mobile) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
    const StudentExist = await Student.findOne({ email: email });
    if (StudentExist) {
        return res.status(422).json({ Error: "Student exist" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const student = new Student({
      name: name.trim(),
      email: email.trim(),
      password: passwordHash,
      mobile: mobile,
      role: 'student',
      active: 1 //TODO: will change later
    });
    const newStudent = await student.save();
    res.status(200).json({ success: true});
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
          //const token = await student.generateAuthToken();
    
          if (!isMatch) {
            console.log("password not match");
            res.status(400).json({ error: "invailid login details" });
          } else {
            console.log("user is logged in");
            const token = jwt.sign({ 
                id: student._id, 
                email: student.email }, 
                process.env.JWT_SECRET);
            res.status(200).json({ message: "login sucessfull", user : student, token });
          }
        } else {
          res.status(400).json({ error: "Student error" });
        }
    } catch (error) {
      res.status(404).json({message: error.message});
    }
}

exports.forgotPassword = async(req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "fill proper details" });
    }
    const student = await Student.findOne({ email });
    if (student) {
      //send mail for password reset link
    } else {
      return res.status(200).json({ error: "Student error" });
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

exports.getDetails = async (req, res)=>{
  try {
    const student = await Student.findById(req.user.id);
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
        const id = req.user.id;
        const userData = req.body.userData;
        const newStudent = await Student.findByIdAndUpdate(id, userData, {new: true});
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
        const id = req.user.id;
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
    const id = req.user.id;
    const { title, company, workMode, startDate, endDate, description } = req.body;

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

exports.editTraining = async(req,res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id; 
    
    const { title, company, workMode, startDate, endDate, description } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the index of the training entry to be edited
    const itemIndex = student.training.findIndex(t => t._id.toString() === itemid);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Training not found for the user' });
    }

    student.training[itemIndex] = {
      _id: itemid,
      title: title,
      company,
      workMode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description
    };

    await student.save();
    return res.status(200).json({sucess : true, messsage : "Training saved."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.deleteTraining = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;

    console.log("delete training id:" + itemid);

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Filter out the experience to be deleted
    student.training = student.training.filter(exp => exp._id.toString() !== itemid);

    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Training deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.getTrainingAll = async(req,res) => {
  try {
    const id = req.user.id;
    const student = await Student.findById(id);
    //return all trainings
    return res.status(200).json({sucess : true, trainings: student.training});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.getTraining = async(req,res) => {
  try {
    const { id, userid } = req.query;
    const student = await Student.findById(userid);
    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    let training= student.training.find(obj => {
      return obj.id === id
    })
    return res.status(200).json({sucess : true, training : training});
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

exports.editExperience = async(req,res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id; 
    
    const { profile, company, workMode, startDate, endDate, description } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the index of the training entry to be edited
    const itemIndex = student.experience.findIndex(t => t._id.toString() === itemid);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Experience not found for the user' });
    }

    student.experience[itemIndex] = {
      _id: itemid,
      profile: profile,
      company,
      workMode,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description
    };
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Experience updated."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}
exports.deleteExperience = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.experience = student.experience.filter(exp => exp._id.toString() !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Experience deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.getExperienceAll = async(req,res) => {
  try {
    const { userid } = req.query;
    console.log("userid:" + userid);
    const student = await Student.findById(userid);
    //return all experiences
    return res.status(200).json({sucess : true, experiences: student.experience});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.getExperience = async(req,res) => {
  try {
    const userid = req.user.id;
    const { id } = req.query;
    const student = await Student.findById(userid);
    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    let experience= student.experience.find(obj => {
      return obj.id === id
    })
    return res.status(200).json({sucess : true, experience : experience});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.addEducation = async(req,res) => {
  try {
    const id = req.user.id;
    const { school, percentage, startDate, endDate, degreeType } = req.body;

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

exports.editEducation = async(req,res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;
    const { school, percentage, startDate, endDate, degreeType } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the index of the education entry to be edited
    const itemIndex = student.education.findIndex(t => t._id.toString() === itemid);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Education not found for the user' });
    }
    student.education[itemIndex] = {
      school,
      percentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      degreeType
    };

    await student.save();
    return res.status(200).json({sucess : true, messsage : "Education updated."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}
exports.deleteEducation = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.education = student.education.filter(exp => exp._id.toString() !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Education deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.getEducationAll = async(req,res) => {
  try {
    const { userid } = req.query;
    console.log("userid:" + userid);
    const student = await Student.findById(userid);
    //return all educations
    return res.status(200).json({sucess : true, educations: student.education});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.getEducation = async(req,res) => {
  try {
    const { id, userid } = req.query;
    const student = await Student.findById(userid);
    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    let education= student.education.find(obj => {
      return obj.id === id
    })
    return res.status(200).json({sucess : true, education : education});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.addSkill = async(req,res) => {
  try {
    const id = req.user.id;
    const { skill } = req.body;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    skill.forEach((item) => {
      console.log("name:" + item.name);
      student.skills.push(item.name);
    });
    
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Skill added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.deleteSkill = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.query.name;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.skills = student.skills.filter(exp => exp !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Skill deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.addProject = async(req,res) => {
  try {
    const id = req.user.id;
    const { title, startDate, endDate, link } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    let entry = {
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      link
    };
    student.projects.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Project added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.editProject = async(req,res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;
    const {title, startDate, endDate, link } = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
     // Find the index of the education entry to be edited
     const itemIndex = student.projects.findIndex(t => t._id.toString() === itemid);
     if (itemIndex === -1) {
       return res.status(404).json({ error: 'Project not found for the user' });
     }

    student.projects[itemIndex] = {
      _id: itemid,
      title,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      link
    };

    await student.save();
    return res.status(200).json({sucess : true, messsage : "Project updated."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.deleteProject = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.projects = student.projects.filter(exp => exp._id.toString() !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Project deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.addAdditional = async(req,res) => {
  try {
    const { details } = req.body;
    const id = req.user.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    let entry = {
      details
    };
    student.additionals.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Additional added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.editAdditional = async(req,res) => {
  try {
    const { details } = req.body;
    const id = req.user.id;
    const itemid = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Find the index of the education entry to be edited
    const itemIndex = student.additionals.findIndex(t => t._id.toString() === itemid);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Education not found for the user' });
    }
    student.additionals[itemIndex] = {
      _id: itemid,
      details
    };
    student.additionals.push(entry);
    await student.save();
    return res.status(200).json({sucess : true, messsage : "Additional added."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.deleteAdditional = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.params.id;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.additionals = student.additionals.filter(exp => exp._id.toString() !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Additional deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.addPreference = async(req,res) => {
  try {
    const id = req.user.id;
    const {  preference } = req.body;
    if(preference == undefined) {
      return res.status(404).json({ error: 'Input not found' });
    }
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    //first clear all exisiting preferences then fill from server
    student.preferences = preference;
    await student.save();
    console.log("stduent:" + student);
    return res.status(200).json({sucess : true, messsage : "preference updated."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.deletePreference = async(req, res) => {
  try {
    const id = req.user.id;
    const itemid = req.query.name;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Filter out the experience to be deleted
    student.preferences = student.preferences.filter(exp => exp !== itemid);
    // Save the updated user
    await student.save();
    
    return res.status(200).json({sucess : true, messsage : "Preferences deleted."});
  } catch(error) {
    return res.status(500).json({error: error.message});
  }
}

exports.applyPost = async(req, res) => {
  try {
    const id = req.user.id;
    const {postid} = req.body;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    const postObj = await Post.findById(postid);
    if(!postObj) {
      return res.status(409).json({sucess : true, messsage : "Invalid post."});
    }
    //add check if post is already applied 
    const alreadyAppliedState = await Application.findOne({
      userId: id,
      postId: postid
    });

    console.log ("alreadyAppliedState: "  + alreadyAppliedState);
    if(alreadyAppliedState) {
      return res.status(409).json({sucess : true, messsage : "application already applied.", appliedStatus: alreadyAppliedState.state});
    }
    //check post also
    const entry = new Application({ userId: id, postId: postid});
    await entry.save();
    //increment count on the post
    postObj.stats.application += 1;
    await postObj.save();
    return res.status(200).json({sucess : true, messsage : "application applied.", appliedStatus: "pending"});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.unApplyPost = async(req, res) => {
  try {
    //if applied post state change to anyother thing, student can't withdraw
    const id = req.user.id;
    const {postid} = req.body;

    const postObj = await Post.findById(postid);
    if(!postObj) {
      return res.status(409).json({sucess : true, messsage : "Invalid post."});
    }
    //add check if post is already applied 
    const alreadyAppliedState = await Application.findOne({
      userId: id,
      postId: postid
    });
    if(!alreadyAppliedState) {
      return res.status(409).json({sucess : true, messsage : "application not applied."});
    }
    //if applied post state change to anyother thing, student can't withdraw
    console.log ("alreadyAppliedState: "  + alreadyAppliedState);
    if(alreadyAppliedState.state != "pending") {
      return res.status(409).json({sucess : true, messsage : "application can't be withdrawn."});
    }
    
    await alreadyAppliedState.remove(); // delete post application
    //check post also
    const entry = new Application({ userId: id, postId: postid});
    await entry.save();
    //increment count on the post
    postObj.stats.application -= 1;
    await postObj.save();
    return res.status(200).json({sucess : true, messsage : "application removed."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

//will return all applied data for an user
exports.allAppliedPosts  = async(req, res) => {
  try {
    const id = req.user.id;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }
    let applications = [];
    let {state} = req.query;
    if(state == undefined)
        state = "all";
    if(state != "all" && state != "pending" &&
        state != "rejected" && state != "shortlist" && 
        state != "hired" && state != "nointerst")
        return res.status(401).send({ msg: "invalid query" })
    if(state == "all")
    {
      applications = await Application.find({ userId: id })
                    .populate({
                      path: 'postId',
                      model: Post,
                      select: 'title ownerId',
                      populate: {
                        path: 'ownerId',
                        model: Employer,
                        select: '_id name'
                      }
                    }).exec();
    }
    else {
      applications = await Application.find({ userId: id, state: state })
      .populate({
        path: 'postId',
        model: Post,
        select: 'title ownerId',
        populate: {
          path: 'ownerId',
          model: Employer,
          select: '_id name'
        }
      }).exec();
    }
    return res.status(200).json({sucess : true, applications : applications});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}

exports.updateSamples = async(req,res) => {
  try {
    const id = req.user.id;
    const { entries } = req.body;

    console.log("entries:" + entries);

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'User not found' });
    }

    if(student.samples != undefined) {
      student.samples.clear();
    }
    
    // Iterate over the array of entries and add them to yourMapField
    entries.forEach(({ key, value }) => {
      const trimmedKey = key.trim();
      const trimmedVal = value.trim();
      student.samples.set(trimmedKey, trimmedVal);
    });

    await student.save();
    return res.status(200).json({sucess : true, messsage : "Samples updated."});
  } catch(error) {
    res.status(500).json({error: error.message});
  }
}