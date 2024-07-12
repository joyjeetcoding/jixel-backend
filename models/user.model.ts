import mongoose from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  fullName: string,
  confirmPassword: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
