import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";

export class ProductController {
    constructor(private productService: ProductService) {
        this.productService = new ProductService();
    }
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
    }
}