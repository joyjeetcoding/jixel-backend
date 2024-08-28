"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lovePost = exports.getAllPosts = exports.getPostById = exports.deletePost = exports.editPost = exports.createPost = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const posts_model_1 = __importDefault(require("../models/posts.model"));
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, summary, description } = req.body;
        const image = req.file;
        let imageUrl;
        if (image) {
            const base64Image = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${base64Image}`;
            const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            imageUrl = uploadResponse.secure_url;
        }
        const newPost = new posts_model_1.default({
            title,
            summary,
            description,
            imgUrl: imageUrl,
            author: req.user._id,
        });
        if (newPost) {
            yield newPost.save();
            res.status(200).json({
                _id: newPost._id,
                title: newPost.title,
                summary: newPost.summary,
                description: newPost.description,
                imgUrl: newPost.imgUrl,
                author: newPost.author,
            });
        }
        else {
            res.status(400).json("Invalid User Post");
        }
    }
    catch (error) {
        console.log("Error in createPost Controller", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.createPost = createPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const image = req.file;
        const post = yield posts_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: "Post Not Found!",
            });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(500).json({
                error: "You are not authorize to edit this post",
            });
        }
        let imageUrl = post.imgUrl;
        if (image) {
            const base64Image = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${base64Image}`;
            const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            imageUrl = uploadResponse.secure_url;
        }
        const updatedData = Object.assign({}, req.body);
        if (imageUrl) {
            updatedData.imgUrl = imageUrl;
        }
        const updatedPost = yield posts_model_1.default.findByIdAndUpdate(postId, updatedData, {
            new: true,
            runValidators: true,
        });
        if (updatedPost) {
            res.status(200).json(updatedPost);
        }
        else {
            res.status(400).json({
                error: "Cannot update this Post",
            });
        }
    }
    catch (error) {
        console.log("Error in edit Post Controller", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const post = yield posts_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({
                error: "Post not found",
            });
        }
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(500).json({
                error: "You are not authorized to delete this post",
            });
        }
        const deledtedPost = yield posts_model_1.default.findByIdAndDelete(postId);
        if (deledtedPost) {
            res.status(200).json("Delete Successfully!");
        }
        else {
            res.status(500).json({
                error: "Failed To Delete this post",
            });
        }
    }
    catch (error) {
        console.log("Error in Delete Post ", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.deletePost = deletePost;
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.id;
        const getPost = yield posts_model_1.default.findById(postId)
            .populate("author", "fullName userName")
            .exec();
        if (getPost) {
            res.status(200).json(getPost);
        }
        else {
            res.status(500).json({
                error: "Failed to get the Post",
            });
        }
    }
    catch (error) {
        console.log("Error in getPostsbyId", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.getPostById = getPostById;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;
        const posts = yield posts_model_1.default.find({})
            .populate("author", "fullName userName")
            .skip(skip)
            .limit(limit)
            .exec();
        const totalPosts = yield posts_model_1.default.countDocuments();
        if (posts) {
            res.status(200).json({
                posts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
            });
        }
        else {
            res.status(500).json({
                error: "Failed to get the Post",
            });
        }
    }
    catch (error) {
        console.log("Error in getPostsbyId", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.getAllPosts = getAllPosts;
const lovePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const post = yield posts_model_1.default.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.lovedBy.includes(userId)) {
            return res.status(400).json({ message: "You have already loved this post" });
        }
        post.loveCount += 1;
        post.lovedBy.push(userId);
        yield post.save();
        return res.status(200).json({
            message: "Post loved successfully",
            loveCount: post.loveCount,
        });
    }
    catch (error) {
        console.log("Error in lovePost Controller ", error.message);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.lovePost = lovePost;
