import express, { RequestHandler } from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category-service";
import logger from "../config/logger";
import asyncWrapper from "../utils/wrapper";
import authenticateMiddleware from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";

const router = express.Router();

const categoryController = new CategoryController(new CategoryService(), logger);

router.post("/",authenticateMiddleware as RequestHandler, canAccess(['admin']), categoryValidator, asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await categoryController.createCategory(req, res, next);
}));

export default router;