import mongoose, { Document, Schema } from "mongoose";

interface UserPosts extends Document {
  title: string;
  summary: string;
  imgUrl: String;
  description: String;
  author: String;
  loveCount: number;
  lovedBy: Schema.Types.ObjectId[];
}

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    loveCount: {
      type: Number,
      default: 0,
    },
    lovedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<UserPosts>("Post", postSchema);

export default PostModel;
