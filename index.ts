import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectToDB";
import authRoute from "./routes/auth.routes";
import postRoute from "./routes/post.routes";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({ 
  cloud_name:  process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/health", async(req:Request, res: Response) => {
  res.send({message: "Health is ok!"})
})

app.use(express.json());
app.use(cookieParser())

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from localhost during development and your production frontend
    const allowedOrigins = [process.env.FRONTEND_URL, 'https://jixel.vercel.app'];

    // If there's no origin or the origin is in the allowed list, allow the request
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow cookies to be sent
}));




app.use("/api/auth", authRoute);
app.use("/api/user", postRoute);

app.listen(PORT, () => {
  console.log(`Server Connected to the port ${PORT}`);
  connectToDB();
});
