"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const post_controller_1 = require("../controller/post.controller");
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.post('/createPost', protectRoute_1.default, upload.single("imgUrl"), post_controller_1.createPost);
// router.put('/createPost/:id', protectRoute, upload.single("imgUrl"), editPost);
// router.delete("/createPost/:id", protectRoute, deletePost);
router.get("/createPost/:id", post_controller_1.getPostById);
router.get("/createPost", post_controller_1.getAllPosts);
router.post("/lovePost/:id", protectRoute_1.default, post_controller_1.lovePost);
exports.default = router;
