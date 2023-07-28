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
    owner: { //company code
      type: String,
      required: true,
    },
    parentId: { //compa id
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
