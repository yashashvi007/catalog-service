import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { ProductService } from "./product-service";
import { Logger } from "winston";
import { Filter, Product } from "./product-types";
import { FileStorage } from "../types/storage";
import { S3Storage } from "../common/services/S3Storage";
import { v4 as uuidv4 } from "uuid";
import { UploadedFile } from "express-fileupload";
import { AuthRequest } from "../types";
import mongoose from "mongoose";

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

        
        // Convert categoryId to ObjectId if it's a valid string
        const categoryIdObjectId = mongoose.Types.ObjectId.isValid(categoryId as string)
            ? new mongoose.Types.ObjectId(categoryId as string)
            : categoryId;

        const product = {
            name: name as string,
            description: description as string,
            image: imageName,
            priceConfiguration: JSON.parse(String(priceConfiguration)) as Record<string, { priceType: "base" | "additional"; availableOptions: Record<string, number> }>,
            attributes: JSON.parse(String(attributes)) as string[],
            tenantId: tenantId as number,
            categoryId: categoryIdObjectId,
            isPublished: isPublished as boolean
        }
        const createdProduct = await this.productService.createProduct(product as unknown as Product);
        this.logger.info(`Product created successfully: ${createdProduct._id.toString()}`);
        res.status(201).json({ id: createdProduct._id });
    }

    async getProducts(req: Request, res: Response) {
        const {q, tenantId, categoryId, isPublished, page, limit}  = req.query;
        const filters: Filter = {};

        if(isPublished === "true") {
            filters.isPublished = true;
        }

        if(tenantId) filters.tenantId = Number(tenantId);

        if(categoryId && mongoose.Types.ObjectId.isValid(categoryId as string) ) filters.categoryId = new mongoose.Types.ObjectId(categoryId as string);

        // Parse pagination parameters with defaults
        const pageNum = page ? Math.max(1, parseInt(String(page), 10)) : 1;
        const limitNum = limit ? Math.max(1, Math.min(100, parseInt(String(limit), 10))) : 10;

        const result = await this.productService.getProducts(
            (q as string) || "",
            filters,
            { page: pageNum, limit: limitNum }
        );
        res.status(200).json(result);
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            return next(createHttpError(400, result.array()[0].msg as string));
        }
        
        const {productId} = req.params;
        //  check if tenant has access to this product
        const productDetails = await this.productService.getProduct(productId);
        if(!productDetails) {
            return next(createHttpError(404, "Product not found"));
        }
        const tenant = (req as AuthRequest).auth?.tenant;
       
        if(productDetails.tenantId.toString() !== tenant.toString()) {
            return next(createHttpError(403, "You are not authorized to update this product"));
        }
        let imageName: string | undefined = undefined;
        let oldImageName: string | undefined = undefined;
        if(req.files?.image) {
            oldImageName = await this.productService.getProductImage(productId);
            const image = req.files.image as UploadedFile;
            imageName = uuidv4();

            await this.storage.upload({
                fileName: imageName,
                fileData: image.data.buffer as ArrayBuffer
            })
            
            await this.storage.delete(oldImageName as string);
        }

        // req.body is untyped here (multipart/form-data), so treat it as unknown
        // Note: priceConfiguration and attributes are already parsed by the validator if they were JSON strings
        const body = req.body as Record<string, unknown>;
        const { name, description, priceConfiguration, attributes, tenantId, categoryId, isPublished } = body;
        
        // Parse JSON strings if they weren't already parsed by the validator
        const parsedPriceConfig = typeof priceConfiguration === 'string' 
            ? JSON.parse(priceConfiguration) as Record<string, { priceType: "base" | "additional"; availableOptions: Record<string, number> }>
            : priceConfiguration as Record<string, { priceType: "base" | "additional"; availableOptions: Record<string, number> }>;
        
        const parsedAttributes = typeof attributes === 'string'
            ? JSON.parse(attributes) as string[]
            : attributes as string[];
        
        // Convert categoryId to ObjectId if it's a valid string
        const categoryIdObjectId = categoryId && mongoose.Types.ObjectId.isValid(categoryId as string)
            ? new mongoose.Types.ObjectId(categoryId as string)
            : categoryId;

        const product = {
            name: name as string,
            description: description as string,
            priceConfiguration: parsedPriceConfig,
            attributes: parsedAttributes,
            tenantId: tenantId as number,
            categoryId: categoryIdObjectId,
            isPublished: isPublished as boolean,
            image: imageName ? imageName : (oldImageName as string),
        } as unknown as Product;

        const updatedProduct = await this.productService.updateProduct(productId, product);
        this.logger.info(`Product updated successfully: ${updatedProduct?._id.toString()}`);
        res.json({ id: updatedProduct?._id });
    }
}