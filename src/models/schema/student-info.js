const { default: mongoose } = require("mongoose");

const trainingSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    workMode: {
        type: String,
        enum: ["remote", "office"]
    },
    startDate: Date,
    endDate : Date,
    Description: {
        type: String,
        trim: true
    }
},
{
    timestamps: true
});

const experienceSchema = new mongoose.Schema({
    profile: {
        type: String,
        trim: true
    },
    company: {
        type: String,
        trim: true
    },
    workMode: {
        type: String,
        enum: ["remote", "office"]
    },
    startDate: Date,
    endDate : Date,
    Description: {
        type: String,
        trim: true
    }
},
{
    timestamps: true
});

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        trim: true
    },
    percentage : Number,
    startDate: Date,
    endDate : Date,
    degreeType: {
        type: String, //x,XII, graduation,
        enum : ["X", "XII", "Graduation"]
    }
},
{
    timestamps: true
});

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    startDate: Date,
    endDate : Date,
    link: String
},
{
    timestamps: true
});

const additionalSchema = new mongoose.Schema({
    details: {
        type: String,
        trim: true
    }
},
{
    timestamps: true
});

module.exports = {trainingSchema, experienceSchema, educationSchema, projectSchema, additionalSchema};