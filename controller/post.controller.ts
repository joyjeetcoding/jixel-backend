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
      author: req.user!._id,
    });

    if (newPost) {
      await newPost.save();

      res.status(200).json({
        _id: newPost._id,
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

export const editPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const image = req.file as Express.Multer.File;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post Not Found!",
      });
    }

    if (post.author.toString() !== req.user!._id.toString()) {
      return res.status(500).json({
        error: "You are not authorize to edit this post",
      });
    }

    let imageUrl = post.imgUrl;

    if (image) {
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

      imageUrl = uploadResponse.secure_url;
    }

    const updatedData = { ...req.body };

    if (imageUrl) {
      updatedData.imgUrl = imageUrl;
    }

    const updatedPost = await PostModel.findByIdAndUpdate(postId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(400).json({
        error: "Cannot update this Post",
      });
    }
  } catch (error: any) {
    console.log("Error in edit Post Controller", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    if (post.author.toString() !== req.user!._id.toString()) {
      return res.status(500).json({
        error: "You are not authorized to delete this post",
      });
    }

    const deledtedPost = await PostModel.findByIdAndDelete(postId);

    if (deledtedPost) {
      res.status(200).json("Delete Successfully!");
    } else {
      res.status(500).json({
        error: "Failed To Delete this post",
      });
    }
  } catch (error: any) {
    console.log("Error in Delete Post ", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const getPost = await PostModel.findById(postId);

    if (getPost) {
      res.status(200).json(getPost);
    } else {
      res.status(500).json({
        error: "Failed to get the Post",
      });
    }
  } catch (error: any) {
    console.log("Error in getPostsbyId", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const getPost = await PostModel.find({}).populate("author", "fullName userName").exec();

    if (getPost) {
      res.status(200).json(getPost);
    } else {
      res.status(500).json({
        error: "Failed to get the Post",
      });
    }
  } catch (error: any) {
    console.log("Error in getPostsbyId", error.message);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};