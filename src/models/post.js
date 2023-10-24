import { ObjectId } from "mongodb";
import mongoose from "mongoose";
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
    skills : {
      type: Array,
      required: false,
      default: [],
    },
    workModel: {
      type: String,
      default: 'remote' //other is office
    },
    workTime: {
      type: String,
      default: 'full' // part -> fulltime, parttime
    },
    location : [{ //cities
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
    owner: { //employer code
      type: String,
      required: true,
    },
    parentId: { //employer id
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    numViews :{
        type: Number,
        default: 0,
    },
    numApplication: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", PostSchema);
export default Post;
