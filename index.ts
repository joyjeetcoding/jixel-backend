import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectToDB";
import authRoute from "./routes/auth.routes.ts";
import postRoute from "./routes/post.routes.ts";
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



app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(cookieParser())

app.use("/api/auth", authRoute);
app.use("/api/user", postRoute);

app.listen(PORT, () => {
  console.log(`Server Connected to the port ${PORT}`);
  connectToDB();
});
