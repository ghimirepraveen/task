import express from "express";
import dontenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import errorHandler from "./controller/error/error.controller";
import { prisma } from "./model/db";

dontenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieparser());
app.use(helmet());
app.use(morgan("dev"));

app.use(errorHandler);

app.listen(process.env.PORT || 4040, () => {
  console.log(`\n🫡 Handle with care, pretty codes ahead! \n`);
  console.log(`ctrl + c to stop server \n`);
  console.log(`Server is running on port ${process.env.PORT || 4040}`);
});
