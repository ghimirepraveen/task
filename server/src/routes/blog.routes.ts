import { Router } from "express";
import { post } from "../controller/blog/blog.controller";
const postRouter = Router();
import uploadToMemory from "../config/multer";
import auth from "../middleware/auth";

postRouter.use(auth);
postRouter.post("/create", uploadToMemory.single("image"), post.create);

export default postRouter;
