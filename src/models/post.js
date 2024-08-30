
const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      min: 10,
      max: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true
    },
    skills : [{
      type: String,
      required: true,
      trim: true
    }],
    workModel: {
      type: String,
      enum : ["remote", "office", "hybrid"],
      default: 'remote' //other is office
    },
    locations : [{ //cities
      type: String
    }],
    numOpening: {
      type: Number,
      default: 1
    },
    duration: {
      type: Number,
      default: 3 //month
    },
    startDate : {
      type : Date
    },
    responsibility: {
      type: String,
      trim: true,
    },
    stipend :{
      type: Number,
      default: 5000
    },
    perks : {
      certificate: {
        type: Boolean,
        default: true,
      },
      lor: {
        type: Boolean,
        default: true,
      },
      flexi: {
        type: Boolean,
        default: true,
      },
      fivedays: {
        type: Boolean,
        default: true,
      }
    }, 
    mobile: { //other contact
      type: String,
      trim: true,
    },
    questions: [{
      type: String,
      trim: true
    }],
    ownerId: { //employer id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employer",
    },
    ppo: { //is ppo comes with internship
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    stats : {
      view :{
          type: Number,
          default: 0,
      },
      application: {
        type: Number,
        default: 0,
      },
      uninterested: {
        type: Number,
        default: 0,
      },
      hired: {
        type: Number,
        default: 0,
      },
    },
    status : { //live must be approved, live will come after approved 
      type : String,
      enum : ["pending", "approved", "live", "closed", "rejected"],
      default: "pending"
    },
    reason : {
      type: String,
      required : function () {
          // (this.status == "rejected" || this.status == "closed")
          return (this.status == "rejected" || this.status == "closed")
      }
  },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to validate the status before saving
PostSchema.pre('save', function (next) {
  console.log("pre save called");
  if (!["pending", "approved", "live", "closed", "rejected"].includes(this.status)) {
    console.log("pre status:" + this.status)
    return next(new Error('Avi Invalid status value'));
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
