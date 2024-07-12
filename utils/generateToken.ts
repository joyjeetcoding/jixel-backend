import jwt from "jsonwebtoken";
import { Response } from "express";

const generatetokenandSetCookie = (userId: Object, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 100,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

export default generatetokenandSetCookie;
