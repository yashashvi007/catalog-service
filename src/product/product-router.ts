import express, { NextFunction, Request, RequestHandler, Response } from "express";
import authenticateMiddleware from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import asyncWrapper from "../utils/wrapper";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import logger from "../config/logger";
import fileUpload from "express-fileupload";
import { S3Storage } from "../common/services/S3Storage";
import createHttpError from "http-errors";
const router = express.Router();
const productController = new ProductController(new ProductService(), logger, new S3Storage());
router.post("/", authenticateMiddleware as RequestHandler, fileUpload({
    // 5MB
    limits: { fileSize: 1024 * 1024 * 5 },
    abortOnLimit: true,
    limitHandler: (req: Request, res: Response, next: NextFunction) => {
        const error  = createHttpError(400, "File size exceeds the limit of 5MB");
        next(error);
    }
}), canAccess(['admin', 'manager']), asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await productController.createProduct(req, res, next);
})) 

export default router;