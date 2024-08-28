"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const multer_1 = __importDefault(require("multer"));
const protectRoute_1 = __importDefault(require("../middleware/protectRoute"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
router.post("/signup", auth_controller_1.signUp);
router.post("/login", auth_controller_1.signIn);
router.post("/logout", auth_controller_1.logout);
router.get("/author/:id", protectRoute_1.default, auth_controller_1.getAuthor);
router.put("/author/:id", upload.single("imageFile"), auth_controller_1.updateAuthor);
exports.default = router;
