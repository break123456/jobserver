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
        enum: ["remote", "office", "hybrid"]
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
        enum: ["remote", "office", "hybrid"]
    },
    location: {
        type: String,
        trim: true
    },
    startDate: Date,
    endDate : Date,
    description: {
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
    startYear: Number,
    endYear: Number,
    stream : {
        type: String,
        trim: true
    },
    board : {
        type: String,
        trim: true
    },
    degree: {
        type: String, //x,XII, graduation,
        enum : ["X", "XII", "Graduation", "Master", "Bachelor", "Master", "PhD"]
    },
    graduationType: {
        type: String, //phd, bteach, post,
        trim: true
    },
    state: {
        type: String,
        enum : ["Pursuing", "Completed"]
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
    link: String,
    description: {
        type: String,
        trim: true
    },
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