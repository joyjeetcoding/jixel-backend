import express from "express";
import { logout, signIn, signUp } from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", logout);


export default router;