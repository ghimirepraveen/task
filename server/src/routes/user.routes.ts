import { Router } from "express";
import { user } from "../controller/user/user.controller";
import auth from "../middleware/auth";

const userRouter = Router();

userRouter.post("/register", user.register);
userRouter.post("/login", user.login);
userRouter.post("/forgotpassword", user.forgetPassword);
userRouter.post("/resetpassword/:token", user.resetPassword);

userRouter.use(auth);
userRouter.post("/changepassword", user.changePassword);
userRouter.put("/update", user.update);
userRouter.get("/me", user.me);
userRouter.post("/logout", user.logout);

export default userRouter;
