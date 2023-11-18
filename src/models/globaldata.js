const mongoose = require('mongoose') 

const GlobalSkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
});

const GlobalPrefSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
});

const GSkill = mongoose.model('GlobalSkill', GlobalSkillSchema);
const GPreference = mongoose.model('GlobalPref', GlobalPrefSchema);

module.exports = {GSkill, GPreference};