const { Employer } = require("../models/user");
const Post = require("../models/post");
const strUtil = require('../helper/string-util')


exports.getPost = async (req, res) => {
    try {
      const { id } = req.params;
      console.log("get post:" + id)
      let post = await Post.findById(id).populate({
        path: 'ownerId',
        model: Employer
      }).exec();
      res.status(200).send({ post: post, msg: "success" })
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
      const posts = await Post.find(filter);
      res.status(200).send({ posts: posts, msg: "success" })
    } catch (error) {
      console.log("error: ", error);
      res.status(401).json({ error: error.message, msg: "Post filter failed" })
    }
}
  