import express from "express";
import {
  getAuthor,
  logout,
  signIn,
  signUp,
  updateAuthor,
} from "../controller/auth.controller";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", logout);

router.get("/author/:id", getAuthor);
router.put("/author/:id", upload.single("imageFile"), updateAuthor);

export default router;
