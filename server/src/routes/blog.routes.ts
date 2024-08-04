import { Router } from "express";
import { post } from "../controller/blog/blog.controller";
const postRouter = Router();
import uploadToMemory from "../config/multer";
import auth from "../middleware/auth";

postRouter.get("/getall", post.getAll);

postRouter.use(auth);
postRouter.post("/create", uploadToMemory.single("image"), post.create);
postRouter.get("/getpost/:id", post.getPost);
postRouter.put("/update/:id", uploadToMemory.single("image"), post.update);
postRouter.put("/changevisibility/:id", post.publish);
postRouter.delete("/delete/:id", post.delete);

export default postRouter;
