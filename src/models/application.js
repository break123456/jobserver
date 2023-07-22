import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema(
  {
    title: { //job title
      type: String,
      required: true,
      trim: true,
      min: 10,
      max: 100,
    },
    tags: {
      type: Array,
      required: false,
      default: [],
    },
    owner: { //user name
      type: String,
      required: true,
    },
    parentId: { //course id
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
    images: {
      type: Array,
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    numLikes: {
      type: Number,
      default: 0,
    },
    numComments:{
      type:Number,
      default:0,
    }
  },
  {
    timestamps: true,
  }
);
const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
