
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
      enum : ["remote", "office"],
      default: 'remote' //other is office
    },
    workTime: {
      type: String,
      enum : ["full", "part"],
      default: 'full' // part -> fulltime, parttime
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
    responsiblity: {
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
      recommend: {
        type: Boolean,
        default: true,
      },
      flexi: {
        type: Boolean,
        default: true,
      },
      days5: {
        type: Boolean,
        default: true,
      },
      freefood: {
        type: Boolean,
        default: true,
      },
    }, 
    questions: [{
      type: String
    }],
    ownerId: { //employer id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Employer",
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
  if (!['pending', 'live', 'closed'].includes(this.status)) {
    console.log("pre status:" + this.status)
    return next(new Error('Avi Invalid status value'));
  }
  next();
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
