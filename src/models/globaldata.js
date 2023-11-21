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

const GlobalCitySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  state: {
    type: String,
    required: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
});

const GSkill = mongoose.model('GlobalSkill', GlobalSkillSchema);
const GPreference = mongoose.model('GlobalPref', GlobalPrefSchema);
const GCity = mongoose.model('GlobalCity', GlobalCitySchema);

module.exports = {GSkill, GPreference, GCity};