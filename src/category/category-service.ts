import CategoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
   async createCategory(category: Category) {
    const newCategory = new CategoryModel(category);
    return newCategory.save();
   }
}