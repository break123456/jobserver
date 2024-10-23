const { Employer, User } = require("../models/user");
const Application = require("../models/application");
const Post = require("../models/post");
const bcrypt = require('bcryptjs');
const strUtil = require('../helper/string-util')
const dns = require('dns');
const dayjs = require('dayjs')
const jwt = require('jsonwebtoken');
const Chatroom = require("../models/chatroom");
const ChatMsg = require("../models/chatmsg");
const {verifyCaptcha} = require("../helper/captcha-util")

exports.employerSignUp = async (req, res) => {
  const { name, email, password, mobile, answer, captchaHex } = req.body;
  if (!name || !email || !password || !mobile || !answer || !captchaHex) {
    return res.status(422).json({ Error: "Plz fill all the field properly.." });
  }
  try {
     //first verify captcha
     const [verifyStatus, errorObj] = await verifyCaptcha(captchaHex, answer);
     if (!verifyStatus) {
       return res.status(422).json({ Error: "Invalid captcha" });
     }

    // Check if a user with the same email or mobile already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    
    if (existingUser) {
      // Determine which field(s) already exist
      if (existingUser.email === email) {
        return res.status(201).json({ Error: "Email in use" });
      }
      if (existingUser.mobile === mobile) {
        return res.status(201).json({ Error: "mobile already exist" });
      }
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
    res.status(201).json({ success: false, message: error.message });
  }
}

exports.employerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(201).json({ message: "fill proper details" });
    }
    console.log("email:" + email + " password:" + password);
    const employer = await Employer.findOne({ email }).select("+password");
    if (employer) {
      const isMatch = await bcrypt.compare(password, employer.password);
      if (!isMatch) {
        console.log("password not match");
        res.status(201).json({ message: "invailid login details" });
      } else {
        //check status
        if (employer.status == "pending") {
          return res.status(202).json({ message: "Account is not active" });
        }
        console.log("employer is logged in");
        const token = jwt.sign({
          id: employer._id,
          email: employer.email
        },
          process.env.JWT_SECRET);
        res.status(200).json({ message: "login sucessfull", user: employer, token });
      }
    } else {
      res.status(201).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(201).json({ message: error.message });
  }
}

exports.employerDetails = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (employer) {
      res.status(200).json({ success: true, employer: employer });
    } else {
      res.status(202).json({ success: false, message: "Account not found" })
    }
  } catch (error) {
    res.status(202).json({ message: error.message });
  }
}

exports.employerDetails = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (employer) {
      const rooms = await Chatroom.find({ empId: req.user.id });
      res.status(200).json({ success: true, rooms: rooms });
    } else {
      res.status(202).json({ success: false, message: "Account not found" })
    }
  } catch (error) {
    res.status(202).json({ message: error.message });
  }
}
exports.updateCompanyDetails = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(202).json({ success: false, message: "Employer not found" })
    }
    const { name, description, numEmployee, address, industry, url } = req.body;

    if (employer.isApproved) {
      name = employer.company.name;
      url = employer.company.domain.url;
    }
    employer.company = {
      description: description,
      numEmployee: numEmployee,
      address: address,
      industry: industry,
      name: name,
      slug: strUtil.createSlug(name),
      domain: {
        url: url
      }
    };
    await employer.save();
    return res.status(200).json({ sucess: true, messsage: "Company data updated successfully!" });
  } catch (error) {
    res.status(202).json({ message: error.message });
  }
}

exports.addPost = async (req, res) => {
  try {
    const id = req.user.id;
    const employer = await Employer.findById(id);
    const { postId, title, skills, locations, workType, numOpening, duration, startDate, responsibility, stipend, perksState, ppo, questions, mobile } = req.body;
    let postSkills = [];
    let postLocs = [];
    skills.forEach((item) => {
      postSkills.push(item.name);
    });
    locations.forEach((item) => {
      postLocs.push(item.city.toLowerCase());
    });
    const slug = strUtil.createSlug(title);
    if (postId === "new") {
      const newPost = new Post({
        title,
        slug: slug,
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
        slug: slug,
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
    return res.status(200).send({ msg: msg, slug: slug })
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

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ success: false, message: "Student not found" })
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
//get posts by this employer
exports.getPosts = async (req, res) => {
  try {
    const { id } = req.user;
    const { state } = req.query;
    console.log("getposts:" + state);
    let posts = [];
    if (state == undefined) {
      posts = await Post.find({ ownerId: id }).select('title slug stats status reason').sort({ updatedAt: -1 });
    } else {
      posts = await Post.find({ ownerId: id, status: state }).select('title slug stats status reason').sort({ updatedAt: -1 });
    }
    res.status(200).send({ posts: posts, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post list failed" })
  }
}

//get posts by this employer
exports.getPostListForChat = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("getPostListForChat:");
    let posts = await Post.find({ ownerId: id }).select('title').sort({ updatedAt: -1 }).limit(10);
    res.status(200).send({ posts: posts, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post list failed" })
  }
}

exports.getRoomMessages = async (req, res) => {
  try {
    const { roomid } = req.query;
    if (roomid == undefined) {
      return res.status(401).json({ msg: "Invalid query" })
    }
    const room = await Chatroom.findById(roomid);
    if (!room) {
      return res.status(401).json({ msg: "Invalid room" })
    }
    const msgs = await ChatMsg.find({ chatroomId: roomid });
    return res.status(200).json({ messages: msgs, msg: "success" })
  } catch (error) {
    console.log("getRoomMessages error: ", error);
    return res.status(401).json({ error: error.message, msg: "room messages failed" })
  }
}

exports.getRoomStudent = async (req, res) => {
  try {
    const { roomid } = req.query;
    if (roomid == undefined) {
      return res.status(401).json({ msg: "Invalid query" })
    }
    const room = await Chatroom.findById(roomid).populate('studentId').exec();
    if (!room) {
      return res.status(401).json({ msg: "Invalid room" })
    }
    return res.status(200).json({ student: room.studentId, msg: "success" })

  } catch (error) {

  }
}

exports.getChatRoom = async (req, res) => {
  try {
    console.log("called getChatRoom");
    const id = req.user.id;
    const { postid, studentid } = req.query;
    let rooms = [];
    if (postid == undefined || studentid == undefined) {
      return res.status(401).json({ msg: "Invalid input" })
    }
    //send all chatrooms
    const room = await Chatroom.findOne({ empId: id, postId: postid, studentId: studentid }).select('_id');
    if (room) {
      return res.status(200).send({ room: room, msg: "success" });
    } else {
      //create room
      const roomData = new Chatroom({
        postId: postid,
        empId: id,
        studentId: studentid
      });
      await roomData.save();
      return res.status(200).send({ roomid: roomData._id, msg: "success" });
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Active chatrooms get failed" })
  }
}


exports.getActiveChatRooms = async (req, res) => {
  try {
    console.log("called getActiveChatRooms");
    const id = req.user.id;
    const { postid } = req.query;
    let rooms = [];
    if (postid == undefined || postid == "none") {
      //send all chatrooms
      rooms = await Chatroom.find({ empId: id })
        .populate({
          path: 'studentId',          // Populate userId with selected fields
          select: 'name email' // Only fetch username and email
        })
        .populate({
          path: 'postId',          // Populate postId with selected fields
          select: 'title'          // Only fetch title of the post
        }).exec();
      return res.status(200).send({ rooms: rooms, msg: "success" });
    } else {
      //send all chatrooms
      rooms = await Chatroom.find({ empId: id, postId: postid })
        .populate({
          path: 'studentId',          // Populate userId with selected fields
          select: 'name email' // Only fetch username and email
        })
        .populate({
          path: 'postId',          // Populate postId with selected fields
          select: 'title'          // Only fetch title of the post
        }).exec();
    }
    console.log("rooms:" + rooms);
    return res.status(200).send({ rooms: rooms, msg: "success" });
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Active chatrooms get failed" })
  }
}

exports.getPostApplicantsForChat = async (req, res) => {
  try {
    console.log("called getPostApplicantsForChat");
    const id = req.user.id;
    const { postid } = req.query;
    if (postid === "none")
      return res.status(200).send({ applicants: [], msg: "success" })
    const post = await Post.findById(postid);
    if (!post) {
      res.status(202).send({ msg: "Invalid post" })
    }
    const applicants = await Application.find({ postId: postid })
      .populate('userId').exec();


    //.populate({ path: 'userId', select: 'name education'}).exec();
    return res.status(200).send({ applicants: applicants, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Post applicants get failed" })
  }
}

// Update the state of an application
exports.updateApplicationState = async (req, res) => {
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

    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostApplications = async (req, res) => {
  try {
    console.log("called getPostApplications");
    const id = req.user.id;
    const { postid, state } = req.query;
    let applications = [];
    const post = await Post.findById(postid);
    if (!post) {
      res.status(202).send({ msg: "Invalid post" })
    }
    if (state == undefined)
      state = "all";
    if (state != "all" && state != "pending" &&
      state != "rejected" && state != "shortlist" &&
      state != "hired" && state != "nointerest")
      return res.status(401).send({ msg: "invalid query" })
    if (state == "all") {
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

exports.getPostApplicationsStatus = async (req, res) => {
  try {
    const id = req.user.id;
    const { postid } = req.query;
    const post = await Post.findById(postid);
    if (!post) {
      res.status(202).send({ msg: "Invalid post" })
    }

    const applications = await Application.find({ postId: postid }).select('state');


    //.populate({ path: 'userId', select: 'name education'}).exec();
    return res.status(200).send({ post: post, applications: applications, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Post applications status get failed" })
  }
}

exports.sendAssignment = async (req, res) => {
  try {
    const empId = req.user.id;
    const { postId, userids, content, deadline } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(202).send({ msg: "Invalid post" })
    }

    const deadlineDate = dayjs(deadline);
    const formattedDate = deadlineDate.format('DD-MM-YY');

    const fullContent = content +  ". Complete by data:" + formattedDate;
    //TODO: verify if userid should applied with this postid
    userids.forEach(async (studentId) => {
      //find if room exist 
      try {
        const result = await Chatroom.findOneAndUpdate(
          { empId: empId, studentId: studentId, postId:postId }, // Find by empId and studentId
          { $setOnInsert: { empId: empId, studentId: studentId, postId:postId , status: "active" } }, // Set fields if document is created
          { upsert: true, new: true } // Create if not found, return the new document
        );
        if (result) {
          //now add chatmsg
          // Save the message to the database
          const chatMessage = new ChatMsg({
            postId: postId,
            chatroomId: result._id,
            sender: empId,
            content: fullContent,
            type: "assignment"
          });
          await chatMessage.save();
        }
      } catch (err) {
        console.error('Error creating or updating document:', err);
        return res.status(401).json({ error: error.message, msg: "Send assignment failed exception" })

      }
    });
    return res.status(200).send({ msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ error: error.message, msg: "Send assignment failed" })
  }
}

exports.verifyDomain = async (req, res) => {
  const { domain, token } = req.body;

  try {
    // Use DNS to query the TXT records for the specified domain
    //const txtRecords = await queryTxtRecords(domain);
    let txtRecords = [];
    dns.resolveTxt(domain, (err, txtRecords) => {
      if (err) {
        console.log('TXT records failed: ' + err.message);
        return res.status(500).json({ error: error.message });
      } else {
        console.log('TXT records: ' + txtRecords.flat());
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
