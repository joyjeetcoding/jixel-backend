import jwt from "jsonwebtoken";
import { Response } from "express";

const generatetokenandSetCookie = (userId: Object, res: Response) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d", // Token expires in 15 days
  });

  res.cookie("jwt", token);
};

export default generatetokenandSetCookie;
