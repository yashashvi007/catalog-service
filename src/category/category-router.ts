import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category-service";

const router = express.Router();

const categoryController = new CategoryController(new CategoryService());

router.post("/", categoryValidator, (req: Request, res: Response, next: NextFunction) => {
    void categoryController.createCategory(req, res, next);
});

export default router;