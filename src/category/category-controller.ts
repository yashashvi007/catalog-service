import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { CategoryService } from "./category-service";
import { Category, PriceConfiguration } from "./category-types";
import { Logger } from "winston";

export class CategoryController {
    constructor(private categoryService: CategoryService, private logger: Logger) {
       this.categoryService = new CategoryService();
       this.logger = logger;
    }

    async getCategories(req: Request, res: Response) {
        const categories = await this.categoryService.getCategories();
        res.status(200).json(categories);
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

    async updateCategory(req: Request, res: Response, next: NextFunction) {
       const result = validationResult(req);
       if(!result.isEmpty()) {
         return next(createHttpError(400, result.array()[0].msg as string));
       }

       const categoryId = req.params.id;
       const updateDate = req.body as Partial<Category>;

       const existingCategory = await this.categoryService.getCategoryById(categoryId);
       if (!existingCategory) {
        return next(createHttpError(404, "Category not found"));
    }

    if (updateDate.priceConfiguration) {
        // Convert existing Map to object if it's a Map
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Object.fromEntries returns any for Map entries
        const existingConfig: PriceConfiguration =
            existingCategory.priceConfiguration instanceof Map
                ? (Object.fromEntries(existingCategory.priceConfiguration) as PriceConfiguration)
                : existingCategory.priceConfiguration;

        // Merge configurations
        const mergedConfig: PriceConfiguration = {
            ...existingConfig,
            ...updateDate.priceConfiguration,
        };

        updateDate.priceConfiguration = mergedConfig;
    }

    const updatedCategory = await this.categoryService.updateCategory(
        categoryId,
        updateDate,
    );

    this.logger.info(`Updated category`, { id: categoryId });

    res.json({
        id: updatedCategory?._id,
    });
    }
}   