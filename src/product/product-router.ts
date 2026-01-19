import express, { NextFunction, Request, RequestHandler, Response } from "express";
import authenticateMiddleware from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import asyncWrapper from "../utils/wrapper";
import { ProductController } from "./product-controller";
import { ProductService } from "./product-service";
import logger from "../config/logger";
import fileUpload from "express-fileupload";
const router = express.Router();
const productController = new ProductController(new ProductService(), logger);
router.post("/", authenticateMiddleware as RequestHandler, fileUpload(), canAccess(['admin', 'manager']), asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    await productController.createProduct(req, res, next);
})) 

export default router;