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
exports.updateAuthor = exports.getAuthor = exports.logout = exports.signIn = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const generateRandomUsername_1 = require("../utils/generateRandomUsername");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, fullName, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords did not matched" });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User's Email already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashPassword = yield bcryptjs_1.default.hash(password, salt);
        let randomUsername = (0, generateRandomUsername_1.generateRandomUsername)();
        while (yield user_model_1.default.findOne({ userName: randomUsername })) {
            randomUsername = (0, generateRandomUsername_1.generateRandomUsername)();
        }
        const newUser = new user_model_1.default({
            email,
            fullName,
            password: hashPassword,
            userName: randomUsername,
        });
        if (newUser) {
            (0, generateToken_1.default)(newUser._id, res);
            yield newUser.save();
            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                userName: newUser.userName
            });
        }
        else {
            res.status(400).json("Invalid User Data");
        }
    }
    catch (error) {
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        const isPassword = yield bcryptjs_1.default.compare(password, (user === null || user === void 0 ? void 0 : user.password) || "");
        if (!user || !isPassword) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        (0, generateToken_1.default)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        });
    }
    catch (error) {
        console.log("Error in Login Controller");
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.signIn = signIn;
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(201).json({ message: "Logged Out Successfully" });
    }
    catch (error) {
        console.log("Error in Logout Controller", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
};
exports.logout = logout;
const getAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const getAuthorDetails = yield user_model_1.default.findById(id);
        if (getAuthorDetails) {
            res.status(200).json(getAuthorDetails);
        }
        else {
            res.status(400).json({
                error: "No Author Found",
            });
        }
    }
    catch (error) {
        console.log("Error in getAuthor Controller: ", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.getAuthor = getAuthor;
const updateAuthor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.body;
        const userId = req.params.id;
        const existsUserName = yield user_model_1.default.findOne({ userName, _id: { $ne: userId } });
        if (existsUserName) {
            return res.status(400).json({
                error: "Username already exists. Please choose a different one.",
            });
        }
        const image = req.file;
        let imageUrl;
        if (image) {
            const base64Image = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${base64Image}`;
            const uploadResponse = yield cloudinary_1.default.v2.uploader.upload(dataURI);
            imageUrl = uploadResponse.secure_url;
        }
        const updatedData = Object.assign({}, req.body);
        if (imageUrl) {
            updatedData.imageUrl = imageUrl;
        }
        const updatedAuthor = yield user_model_1.default.findByIdAndUpdate(userId, updatedData, {
            new: true,
            runValidators: true,
        });
        if (updatedAuthor) {
            res.status(200).json(updatedAuthor);
        }
        else {
            res.status(400).json({
                error: "Cannot update this",
            });
        }
    }
    catch (error) {
        console.error("Error in update author Controller: ", error.message);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.updateAuthor = updateAuthor;
