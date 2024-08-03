import asyncCatch from "../../error/asyncAwait.error";
import { Request, Response, NextFunction } from "express";
import customError from "../../error/custome.error";
import { prisma } from "../../model/db";
import bcrypt from "bcrypt";
import { validateEmail } from "../../util/validate";
import { validatePassword } from "../../util/validate";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "../../util/sendEmail";
import { JWT_SECRET, COOKIES_NAME } from "../../config/key";

export const user = {
  register: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        throw new customError("email and password are required", 400);
      }
      validateEmail(email);
      validatePassword(password);
      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userExist) {
        throw new customError("user already exist", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      const {
        password: _,
        id: undefined,
        createdAt,
        updatedAt,
        ...userdata
      } = user;
      console.log(userdata);

      res.status(201).json(userdata);
    }
  ),

  login: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new customError("email and password are required", 400);
    }
    validateEmail(email);
    validatePassword(password);
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new customError("user not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new customError("invalid credentials", 401);
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    let sanitizedUser = {
      ...user,
      id: undefined,
      password: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };

    res
      .status(200)
      .cookie(
        COOKIES_NAME as string,
        JSON.stringify({ token, user: sanitizedUser }),
        {
          path: "/",
          secure: false,
          maxAge: 86400,
        }
      )
      .json({
        user: sanitizedUser,
        token,
      });
  }),

  me: asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    res.status(200).json(user);
  }),

  logout: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      res
        .status(200)
        .clearCookie(COOKIES_NAME as string)
        .json({ message: "logout successfully" });
    }
  ),

  update: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name } = req.body;
      if (!name) {
        throw new customError("name are required", 400);
      }
      const user = await prisma.user.update({
        where: {
          id: req.user.id,
        },
        data: {
          name,
        },
      });

      const sanitizedUser = {
        ...user,
        id: undefined,
        password: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };

      res.status(200).json(user);
    }
  ),

  forgetPassword: asyncCatch(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      throw new customError("Email is required", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new customError("User not found", 404);
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET as string, {
      expiresIn: "10m",
    });

    await sendResetPasswordEmail(email, token);

    res.status(200).json({ message: "Email sent" });
  }),
  resetPassword: asyncCatch(async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword, verifiedPassword } = req.body;

    if (!newPassword || !verifiedPassword) {
      throw new customError("New password is required", 400);
    }

    if (newPassword !== verifiedPassword) {
      throw new customError("Passwords do not match", 400);
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET as string);
    } catch (err) {
      throw new customError("Invalid or expired token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: (decodedToken as any).userId },
    });

    if (!user) {
      throw new customError("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated" });
  }),

  changePassword: asyncCatch(async (req: Request, res: Response) => {
    const { oldPassword, newPassword, verifiedPassword } = req.body;

    if (!oldPassword || !newPassword || !verifiedPassword) {
      throw new customError("All fields are required", 400);
    }

    if (newPassword !== verifiedPassword) {
      throw new customError("Passwords do not match", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new customError("User not found", 404);
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new customError("Invalid credentials", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated" });
  }),
};
