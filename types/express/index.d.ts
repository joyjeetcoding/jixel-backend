import { UserDocument } from "../../models/user.model";

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
  }
}

declare module 'bcryptjs';
declare module 'cookie-parser';
declare module 'jsonwebtoken';
declare module 'multer';