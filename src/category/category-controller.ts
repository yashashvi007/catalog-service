import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CategoryService } from "./category-service";
import { Category } from "./category-types";

export class CategoryController {
    constructor(private categoryService: CategoryService) {
       this.categoryService = new CategoryService();
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

        res.status(201).json({ id: createdCategory._id });
    }
}   