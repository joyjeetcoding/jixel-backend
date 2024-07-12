import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import generatetokenandSetCookie from "../utils/generateToken";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, fullName, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords did not matched" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User's email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashPassword,
    });

    if (newUser) {
      generatetokenandSetCookie(newUser._id, res);

      await newUser.save();

      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      });
    } else {
      res.status(400).json("Invalid User Data");
    }
  } catch (error: any) {
    console.log("Error in Signup Controller", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPassword) {
      return res.status(400).json({ error: "Invalid Email-ID or password" });
    }

    generatetokenandSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error: any) {
    console.log("Error in Login Controller");
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(201).json({ message: "Logged Out Successfully" });
  } catch (error: any) {
    console.log("Error in Logout Controller", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
