import express from "express";
import { CategoryController } from "./category-controller";
import categoryValidator from "./category-validator";
import { Request, Response } from "express";

const router = express.Router();

const categoryController = new CategoryController();

router.post("/", categoryValidator, (req: Request, res: Response) => {
    void categoryController.createCategory(req, res);
});

export default router;