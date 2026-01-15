import ProductModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        const newProduct = new ProductModel(product);
        return newProduct.save();
    }
}