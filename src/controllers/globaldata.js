const {GSkill, GPreference, GCity}= require("../models/globaldata");
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

exports.cities = async (req, res) => {
    try {
        const {filter} = req.query;
        if(filter == undefined || filter == "none")
        {
            const items = await GCity.find({}).select('name -_id');
            return res.status(200).json({"success": true, cities: items});

            //return res.status(400).json({ error: "no filter text passed" });
        }
        if(filter.length < 3)
        {
            return res.status(400).json({ error: "Minimum length 3" });
        }
        const items = await GCity.find({ name: { $regex: new RegExp(filter, 'i') } }).select('name -_id');
        res.status(200).json({"success": true, cities: items});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};