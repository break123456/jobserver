const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        min: 5,
        max: 20
    },
    uniqName:{ //uniq code for every user
        type: String,
        trim: true,
        min: 5,
        max: 20
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
    },
    mobile:{
        type: String,
        min: 10,
        default:''
    },
    active:{
        type: Boolean,
        default: 1
    },
    image:{
        type: String
    },
    role:{ //admin -1, student -0
        type: Boolean,
        default: 0
    },
    status:{
        type: Boolean,
        default: 1
    },
    refId: { //referene id of admin or student full data
        type: String
    }
},
{
    timestamps:true,
});
 
const user = mongoose.model('user', userSchema);
module.exports= user;