import express from "express"
import multer from "multer";
import { createPost, deletePost, editPost, getAllPosts, getPostById } from "../controller/post.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/createPost', protectRoute, upload.single("imgUrl"), createPost);
router.put('/createPost/:id', protectRoute, upload.single("imgUrl"), editPost);
router.delete("/createPost/:id", protectRoute, deletePost);
router.get("/createPost/:id", getPostById);
router.get("/createPost", getAllPosts);

export default router;