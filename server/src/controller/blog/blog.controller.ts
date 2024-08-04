import asyncCatch from "../../error/asyncAwait.error";
import { Request, Response, NextFunction } from "express";
import customError from "../../error/custome.error";
import { prisma } from "../../model/db";
import uploadPhoto from "../../config/cloudnery";
import { stringToBoolean } from "../../util/stringtoboolen";

export const post = {
  create: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
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
  getAll: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = 6;

      const posts = await prisma.post.findMany({
        where: {
          published: true,
        },
        include: {
          imgs: {
            where: { isactive: true },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      });

      const totalPosts = await prisma.post.count({
        where: {
          published: true,
        },
      });

      const totalPages = Math.ceil(totalPosts / pageSize);

      res.status(200).json({
        posts,
        meta: {
          totalPosts,
          totalPages,
          currentPage: page,
        },
      });
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
          imgs: {
            where: { isactive: true },
          },
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

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new customError("post not found", 404);
      }

      if (post.authorId !== req.user.id) {
        throw new customError("Not authorized", 403);
      }

      const publishPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          published: true,
        },
      });

      res.status(200).json(publishPost);
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

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new customError("post not found", 404);
      }

      if (post.authorId !== req.user.id) {
        throw new customError("Not authorized", 403);
      }

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
          imgs: {
            where: { isactive: true },
          },
        },
      });
      res.status(200).json(updatedPost);
    }
  ),

  delete: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId = req.params.id;

      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new customError("post not found", 404);
      }

      if (post.authorId !== req.user.id) {
        throw new customError("Not authorized", 403);
      }

      await prisma.img.deleteMany({
        where: { postId: postId },
      });

      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      res.status(200).json({ message: "post deleted" });
    }
  ),
};
