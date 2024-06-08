const Application  = require("../models/application");
const { Student } = require("../models/user");

const Post = require("../models/post");

// Apply for a job
exports.apply = async (req, res) => {
    try {
        const { userId, postId, answers } = req.body;
        const application = new Application({ userId, postId, answers });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
// Get all applications for a specific job post
exports.filter = async (req, res) => {
    try {
        const { postId } = req.query;
        const applications = await Application.find({ postId: postId }).populate({
            path:'userId',
            model: Student
        }).exec();;
        res.status(200).json({applications: applications});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 
exports.getById = async(req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        res.status(200).json({application: application});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateById = async(req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);
        res.status(200).json({application: application});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.deleteById = async(req, res) => {
    try {
        const { id } = req.params;
        const application = await Application.deleteById(id);
        res.status(200).json({application: application});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}