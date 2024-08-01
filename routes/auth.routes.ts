import express from "express";
import { getAuthor, logout, signIn, signUp, updateAuthor } from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", logout);

router.get("/author/:id", getAuthor)
router.put("/author/:id", updateAuthor)

export default router;