import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../models/user.model";

interface DecodedToken {
  userId: Object;
}

declare global {
  namespace Express {
    interface Request {
      user: UserDocument;
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header is present and has the Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user as UserDocument;

    next();
  } catch (error: any) {
    console.log("Error in Protect Route: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
