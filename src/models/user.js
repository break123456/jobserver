const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const {trainingSchema, experienceSchema, educationSchema, projectSchema, additionalSchema} = require('./schema/student-info')
const companySchema = require('./schema/company-info')

// Base user schema
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        min: 3,
        max: 20
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    mobile: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
    },    
    role: { 
        type: String, 
        enum : ["student", "employer", "admin"],
        default: 'student'
    },    
    active:{
        type: Boolean,
        default: 1
    },
    status:{
        type: String,
        default: "pending",
        enum : ["pending", "rejected", "active", "disabled"],
    },
    reason : {
        type: String,
        required : function (){
            return (this.status == "rejected" || this.status == "disabled")
        }
    },
    refId: { 
        type: String
    }
},{
    timestamps:true,
});

// Discriminator schemas for each role -->
const studentSchema = new mongoose.Schema({
    skills : [{
        type: String,
        lowercase: true,
    }],
    location: {
        type : String,
    },
    preferences : [{
        type: String,
        lowercase: true,
        trim: true
    }],
    gender : {
        type : String,
        enum: ["Male", "Female", "Other"],
    },
    profession : {
        type : String,
        enum: ["Fresher", "Student", "Professional"],
    },
    workMode : {
        type : String,
        enum: ["Office", "Remote", "Hybrid"],
    },
    languages : [{
        type: String,
        trim: true
    }],
    samples : { //github, other work links
        type: Map,
        of: String
    },
    experience: [experienceSchema],
    education: [educationSchema],
    training: [trainingSchema],
    projects: [projectSchema],
    additionals : [additionalSchema]
});

const employerSchema = new mongoose.Schema({
    company: companySchema,
    isApproved: { //once approved can't edit company name
        type: Boolean,
        default: false
    },
    
});

const adminSchema = new mongoose.Schema({
    // Additional fields specific to admins
});


// Generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET)
        await this.save()
        return token
    } catch (error) {
        console.log(error)
    }
}
//  token to reset password
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000 //10 minutes
    return resetToken
}

//    hashing the password...
userSchema.pre('save', async function (next) {
    console.log('hi bcrypt')
    /*
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }*/
    next()
})


const User = mongoose.model("User", userSchema);

const Student = User.discriminator("Student", studentSchema);
const Employer = User.discriminator("Employer", employerSchema);
const Admin = User.discriminator("Admin", adminSchema);


module.exports = {User, Student, Employer, Admin};