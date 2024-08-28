"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectToDB_1 = __importDefault(require("./db/connectToDB"));
const auth_routes_ts_1 = __importDefault(require("./routes/auth.routes.ts"));
const post_routes_ts_1 = __importDefault(require("./routes/post.routes.ts"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_1 = require("cloudinary");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL, // Your frontend URL (e.g., http://localhost:3000)
    credentials: true // Include credentials (cookies, authentication headers, etc.)
}));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_ts_1.default);
app.use("/api/user", post_routes_ts_1.default);
app.listen(PORT, () => {
    console.log(`Server Connected to the port ${PORT}`);
    (0, connectToDB_1.default)();
});
