import jwt from "jsonwebtoken";
import { Response } from "express";

const generatetokenandSetCookie = (userId: Object, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d", // Token expires in 15 days
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Cookie cannot be accessed via JavaScript
    sameSite: "strict", // Ensure this is appropriate for your use case
    secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
  });
};

export default generatetokenandSetCookie;
