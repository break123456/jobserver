const {GSkill, GPreference}= require("../models/globaldata");
const Post = require("../models/post");


exports.skills = async (req, res) => {
    try {
        const skill= await GSkill.find().select('name -_id');
        res.status(200).json({"success": true, skills:skill});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.preferences = async (req, res) => {
    try {
        const items = await GPreference.find().select('name -_id');
        res.status(200).json({"success": true, preferences: items});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};