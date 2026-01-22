import productModel from "./product-model";
import { Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        const newProduct = new productModel(product);
        return newProduct.save();
    }

    async getProducts() {
        return productModel.find();
    }

    async getProduct(productId: string): Promise<Product | null>{
        return await productModel.findById(productId)
    }
 
    async getProductImage(productId: string) {
        const product = await productModel.findById(productId);
        return product?.image;
    }

    async updateProduct(productId: string, product: Product) {
        return await productModel.findByIdAndUpdate(productId, {$set: product}, {new: true});
    }
}