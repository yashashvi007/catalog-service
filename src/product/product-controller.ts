import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Logger } from "winston";
import { Product } from "./product-types";
import { FileStorage } from "../types/storage";
import { S3Storage } from "../common/services/S3Storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";

export class ProductController {
    constructor(private productService: ProductService, private logger: Logger, private storage: FileStorage) {
        this.productService = new ProductService();
        this.storage = new S3Storage();
    }
    async createProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }

        const { name, description, priceConfiguration, attributes, tenantId, categoryId, isPublished } = req.body as Record<string, unknown>;
      
        const image = req.files?.image as UploadedFile;
        const imageName = uuidv4();
        
        await this.storage.upload({
            fileName: imageName,
            fileData: image.data.buffer as ArrayBuffer
        })

        
        const product = {
            name: name as string,
            description: description as string,
            image: imageName,
            priceConfiguration: JSON.parse(String(priceConfiguration)) as Record<string, { priceType: "base" | "additional"; availableOptions: Record<string, number> }>,
            attributes: JSON.parse(String(attributes)) as string[],
            tenantId: tenantId as number,
            categoryId: categoryId as string,
            isPublished: isPublished as boolean
        }
        const createdProduct = await this.productService.createProduct(product as unknown as Product);
        this.logger.info(`Product created successfully: ${createdProduct._id.toString()}`);
        res.status(201).json({ id: createdProduct._id });
    }
}