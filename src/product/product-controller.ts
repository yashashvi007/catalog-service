import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Product } from "./product-types";
import { Logger } from "winston";

export class ProductController {
    constructor(private productService: ProductService, private logger: Logger) {
        this.productService = new ProductService();
    }
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, description, image, priceConfiguration, attributes, tenantId, categoryId, isPublished } = req.body as Product;
        const createdProduct = await this.productService.createProduct({name, description, image, priceConfiguration, attributes, tenantId, categoryId, isPublished});
        this.logger.info(`Product created successfully: ${createdProduct._id.toString()}`);
        res.status(201).json({ id: createdProduct._id });
    }
}