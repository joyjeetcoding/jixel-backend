import mongoose, { Schema } from "mongoose";


interface UserPosts extends Document {
    title: string;
    summary: string;
    imgUrl: String;
    description: String;
    author: String;
}

const postSchema = new mongoose.Schema({
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
    },
    description: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
}, {
    timestamps: true,
});

const PostModel = mongoose.model<UserPosts>("Post", postSchema);

export default PostModel;
