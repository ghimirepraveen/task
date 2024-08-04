import asyncCatch from "../../error/asyncAwait.error";
import { Request, Response, NextFunction } from "express";
import customError from "../../error/custome.error";
import { prisma } from "../../model/db";
import uploadPhoto from "../../config/cloudnery";
import { stringToBoolean } from "../../util/stringtoboolen";

export const post = {
  create: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      //   const title = req.body.title as string;
      //   const content = req.body.content as string;
      const published = stringToBoolean(req.body.published);
      const userId = req.user.id;

      const { title, content } = req.body;

      let imgUrl;
      if (req.file) imgUrl = await uploadPhoto(req.file);

      if (!title || !content) {
        throw new customError("title and content are required", 400);
      }

      const blog = await prisma.post.create({
        data: {
          title,
          content,
          authorId: userId,
          published: published || false,
          imgs: imgUrl
            ? {
                create: {
                  url: imgUrl,
                },
              }
            : undefined,
        },
      });

      res.status(201).json(blog);
    }
  ),

  getPosts: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const posts = await prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          imgs: true,
        },
      });

      res.status(200).json(posts);
    }
  ),

  getPost: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
          published: true,
        },
        include: {
          imgs: true,
        },
      });

      if (!post) {
        throw new customError("post not found", 404);
      }

      res.status(200).json(post);
    }
  ),

  publish: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;

      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          published: true,
        },
      });

      res.status(200).json(post);
    }
  ),

  update: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;
      const title = req.body.title as string;
      const content = req.body.content as string;
      const published = stringToBoolean(req.body.published);

      if (!title || !content) {
        throw new customError("Title and content are required", 400);
      }

      let imgUrl;
      if (req.file) imgUrl = await uploadPhoto(req.file);

      const updateData: any = {
        title,
        content,
        published,
        updatedAt: new Date(),
      };

      if (imgUrl) {
        updateData.imgs = {
          updateMany: {
            where: { postId, isactive: true },
            data: { isactive: false },
          },
          create: {
            url: imgUrl,
            isactive: true,
          },
        };
      }

      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: updateData,
        include: {
          imgs: true,
        },
      });
      res.status(200).json(updatedPost);
    }
  ),

  delete: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;

      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      res.status(200).json({ message: "post deleted" });
    }
  ),
};
