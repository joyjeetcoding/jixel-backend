import { Request, Response } from "express";
import User, { UserDocument } from "../models/user.model";
import bcrypt from "bcryptjs";
import generatetokenandSetCookie from "../utils/generateToken";
import cloudinary from "cloudinary";
import { generateRandomUsername } from "../utils/generateRandomUsername";
import jwt from "jsonwebtoken";

const generatetoken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d", // Token expires in 15 days
  });
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, fullName, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords did not matched" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "User's Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    let randomUsername = generateRandomUsername();

    while(await User.findOne({userName : randomUsername})) {
      randomUsername = generateRandomUsername();
    }

    const newUser: UserDocument = new User({
      email,
      fullName,
      password: hashPassword,
      userName: randomUsername,
    });

    if (newUser) {
      

      await newUser.save();
      const token = generatetoken(newUser._id.toString());

      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userName: newUser.userName,
        token
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
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generatetoken(user._id.toString());

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token
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
    res.status(201).json({ message: "Logged Out Successfully" });
  } catch (error: any) {
    console.log("Error in Logout Controller", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getAuthor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const getAuthorDetails = await User.findById(id);

    if (getAuthorDetails) {
      res.status(200).json(getAuthorDetails);
    } else {
      res.status(400).json({
        error: "No Author Found",
      });
    }
  } catch (error: any) {
    console.log("Error in getAuthor Controller: ", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const { userName } = req.body;
    const userId = req.params.id;

    const existsUserName = await User.findOne({ userName, _id: { $ne: userId } });

    if (existsUserName) {
      return res.status(400).json({
        error: "Username already exists. Please choose a different one.",
      });
    }
    const image = req.file as Express.Multer.File;
    let imageUrl;

    if(image) {
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  
      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

      imageUrl = uploadResponse.secure_url;
    }
    
    const updatedData = {...req.body};
    if(imageUrl) {
      updatedData.imageUrl = imageUrl;
    }

    const updatedAuthor = await User.findByIdAndUpdate(
      userId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );


    if (updatedAuthor) {
      res.status(200).json(updatedAuthor);
    } else {
      res.status(400).json({
        error: "Cannot update this",
      });
    }
  } catch (error: any) {
    console.error("Error in update author Controller: ", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

