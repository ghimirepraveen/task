import asyncCatch from "../../error/asyncAwait.error";
import { Request, Response, NextFunction } from "express";
import customError from "../../error/custome.error";

export const user = {
  login: asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {}
  ),
};
