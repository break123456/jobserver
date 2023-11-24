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

exports.filterPost = async (req, res) => {
    try {
      const { id } = req.query;
      let posts = await Post.find({ ownerId: id });
      res.status(200).send({ posts: posts, msg: "success" })
    } catch (error) {
      console.log("error: ", error);
      res.status(401).json({ error: error.message, msg: "Post filter failed" })
    }
}
  