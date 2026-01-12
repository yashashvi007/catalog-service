import CategoryModel from "./category-model";
import { Category } from "./category-types";

export class CategoryService {
   async createCategory(category: Category) {
    const newCategory = new CategoryModel(category);
    return newCategory.save();
   }

   async getCategories() {
    return await CategoryModel.find();
   }

   async getCategoryById(categoryId: string) {
      return await CategoryModel.findById(categoryId);
   }

   async updateCategory(categoryId: string, updateData: Partial<Category>) {
      return await CategoryModel.findByIdAndUpdate(categoryId, {$set: updateData}, {new: true});
   }
}