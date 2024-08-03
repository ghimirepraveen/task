import { Router } from "express";
import { user } from "../controller/user/user.controller";
import auth from "../middleware/auth";

const userRouter = Router();

userRouter.post("/register", user.register);
userRouter.post("/login", user.login);
userRouter.post("/forgotpassword");
userRouter.post("/resetpassword/:token");

userRouter.use(auth);
userRouter.post("/changePassword", user.changePassword);
userRouter.post("/update", user.update);
userRouter.post("/me", user.me);
userRouter.post("/logout", user.logout);

export default userRouter;
