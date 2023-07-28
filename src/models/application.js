import { ObjectId } from "mongodb";
import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema(
  {
    
    owner: { //user name
      type: String,
      required: true,
    },
    parentId: { //course id
      type: Schema.Types.ObjectId,
      required: true,
      ref: "course",
    },
    state :{
      type : String
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    numLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Application = mongoose.model("Application", ApplicationSchema);
export default Application;
