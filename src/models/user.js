const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const {trainingSchema, experienceSchema, educationSchema, projectSchema} = require('./schema/student-info')

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
    // role: { 
    //     type: String, 
    // },    
    active:{
        type: Boolean,
        default: 1
    },
    status:{
        type: Boolean,
        default: 1
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
    preferences : {
        type : Array,
        default : [],
    },
    workMode : {
        type : String,
        enum: ["office", "remote", "both"],
    },
    experience: [experienceSchema],
    education: [educationSchema],
    training: [trainingSchema],
    projects: [projectSchema],
    additionals : [{
        type: String,
        trim: true
    }]
});

const employerSchema = new mongoose.Schema({
    company: { 
        type: String, 
    },
    slug: {
        type: String,
        lowercase : true
    }
    
});

const adminSchema = new mongoose.Schema({
    // Additional fields specific to admins
});


// Generating token
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET)
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
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next()
})


const User = mongoose.model("User", userSchema);

const Student = User.discriminator("Student", studentSchema);
const Employer = User.discriminator("Employer", employerSchema);
const Admin = User.discriminator("Admin", adminSchema);


module.exports = {User, Student, Employer, Admin};