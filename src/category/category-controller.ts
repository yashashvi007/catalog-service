import { Request, Response } from "express";

export class CategoryController {
    async createCategory(req: Request, res: Response) {
        res.json({
            message: "Category created successfully"
        })
    }
}