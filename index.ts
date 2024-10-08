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

app.use(cors());


app.use("/api/auth", authRoute);
app.use("/api/user", postRoute);

app.listen(PORT, () => {
  console.log(`Server Connected to the port ${PORT}`);
  connectToDB();
});
