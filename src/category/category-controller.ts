import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CategoryService } from "./category-service";
import { Category } from "./category-types";
import { Logger } from "winston";

export class CategoryController {
    constructor(private categoryService: CategoryService, private logger: Logger) {
       this.categoryService = new CategoryService();
       this.logger = logger;
    }

    async createCategory(req: Request, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            const firstError = result.array()[0];
            const errorMessage = (firstError && typeof firstError.msg === 'string') ? firstError.msg : 'Invalid value';
            return next(createHttpError(400, errorMessage));
        }
        const { name, priceConfiguration, attributes} = req.body as Category;

        const createdCategory = await this.categoryService.createCategory({name, priceConfiguration, attributes});
        this.logger.info(`Category created successfully: ${createdCategory._id.toString()}`);
        res.status(201).json({ id: createdCategory._id });
    }   
}   