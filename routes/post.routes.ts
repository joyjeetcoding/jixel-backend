import express from "express"
import multer from "multer";
import { createPost } from "../controller/post.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/createPost', protectRoute, createPost);

export default router;