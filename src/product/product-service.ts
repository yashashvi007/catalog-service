import productModel from "./product-model";
import { Filter, Product } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        const newProduct = new productModel(product);
        return newProduct.save();
    }

    async getProducts(q: string, filters: Filter): Promise<Product[]> {
        const matchQuery: Record<string, unknown> = {
            ...filters
        };
        
        if (q && q.trim() !== "") {
            const searchQueryRegexp = new RegExp(q, "i");
            matchQuery.name = searchQueryRegexp;
        }
        
        const aggregate = productModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            }
        ])

        const result = await aggregate.exec();
        return result as Product[];
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