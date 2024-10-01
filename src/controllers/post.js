const { Employer } = require("../models/user");
const Application = require("../models/application")
const Post = require("../models/post");
const strUtil = require('../helper/string-util')


exports.getPost = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("get post:" + id)
      let post = await Post.findById(id).populate({
        path: 'ownerId',
        model: Employer,
       // select: 'name description'
      }).exec();
      let appliedStatus = "none";
      console.log("getpost: post:" + post);
      console.log("user:" + req.user);
      if(req.user != undefined)
      {
        console.log("userdi:" + req.user.id);
        //check user status for this post 
        //add check if post is already applied 
        const alreadyAppliedState = await Application.findOne({
          userId: req.user.id,
          postId: id
        });

        console.log ("alreadyAppliedState: "  + alreadyAppliedState);
        if(alreadyAppliedState) {
          appliedStatus = alreadyAppliedState.state;
          return res.status(200).json({post : post, appliedStatus: appliedStatus, messsage : "application already applied."});
        }
      }
      return res.status(200).send({ post: post, appliedStatus:appliedStatus, msg: "success" })
    } catch (error) {
      console.log("error: ", error);
      res.status(401).json({ error: error.message, msg: "Post get failed" })
    }
}

exports.getPostByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    console.log("get post:" + title)
    let post = await Post.findOne({slug: title}).populate({
      path: 'ownerId',
      model: Employer,
     // select: 'name description'
    }).exec();
    if(!post) {
      return res.status(401).json({ msg: "Post get failed" })
    }
    const postid = post._id;
    let appliedStatus = "none";
    console.log("getpost: post:" + post);
    console.log("user:" + req.user);
    if(req.user != undefined)
    {
      console.log("userdi:" + req.user.id);
      //check user status for this post 
      //add check if post is already applied 
      const alreadyAppliedState = await Application.findOne({
        userId: req.user.id,
        postId: postid
      });

      console.log ("alreadyAppliedState: "  + alreadyAppliedState);
      if(alreadyAppliedState) {
        appliedStatus = alreadyAppliedState.state;
        return res.status(200).json({post : post, appliedStatus: appliedStatus, messsage : "application already applied."});
      }
    }
    return res.status(200).send({ post: post, appliedStatus:appliedStatus, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post get failed" })
  }
}

// filter by skills, location, stipend, start date, duration
exports.filterPost = async (req, res) => {
    try {
      const { skills, locations, workModel, startDate, maxDuration, minStipend } = req.query;
      // Build the filter object based on the provided criteria
      const filter = {};

      if (skills) {
        filter.skills = skills.split(',');
      }

      if (workModel) {
        filter.workModel = workModel;
      }

      if (locations) {
        // If locations is a single value, convert it to an array
        filter.locations = locations.split(',');
      }

      //start Date
      if(startDate) {
        filter.startDate.$gte = startDate;
      }
      //max  duration
      if (maxDuration) {
        filter.duration = {};
        filter.duration.$lte = parseInt(maxDuration, 10);      
      }

      //min stiend
      if (minStipend) {
        filter.stipend = {};
        filter.stipend.$gte = parseInt(minStipend, 10);      
      }

      // Query the database with the constructed filter
      const posts = await Post.find(filter).populate({
        path: 'ownerId',
        model: Employer
      }).sort({ createdAt: -1 });
      res.status(200).send({ posts: posts, msg: "success" })
    } catch (error) {
      console.log("error: ", error);
      res.status(401).json({ error: error.message, msg: "Post filter failed" })
    }
}
  
exports.landingPosts = async (req, res) => {
  try {
    if(req.user != undefined)
    {
      console.log("userdi:" + req.user.id);
      //check user status for this post 
      //add check if post is already applied 
      const posts= await Post.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (latest first)
      .limit(10); // Limit the results to 10 posts
      return res.status(200).json({posts : posts,  messsage : ""});
    }

    const posts= await Post.find({})
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (latest first)
      .limit(10); // Limit the results to 10 posts
    return res.status(200).send({ posts: posts, msg: "success" })
  } catch (error) {
    console.log("error: ", error);
    res.status(401).json({ error: error.message, msg: "Post get failed" })
  }
}