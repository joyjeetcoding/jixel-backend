import cloudinary from "cloudinary";
import { Request, Response } from "express";
import PostModel from "../models/posts.model";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, summary, description } = req.body;

    const image = req.file as Express.Multer.File;

    let imageUrl;
    if (image) {
      const base64Image = Buffer.from(image.buffer).toString("base64");

      const dataURI = `data:${image.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

      imageUrl = uploadResponse.secure_url;
    }

    const newPost = new PostModel({
      title,
      summary,
      description,
      imgUrl: imageUrl,
    });

    if (newPost) {
      await newPost.save();

      res.status(200).json({
        title: newPost.title,
        summary: newPost.summary,
        description: newPost.description,
        imgUrl: newPost.imgUrl,
        author: newPost.author,
      });
    } else {
      res.status(400).json("Invalid User Post");
    }
  } catch (error: any) {
    console.log("Error in createPost Controller", error.message);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
