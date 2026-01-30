import productModel from "./product-model";
import { Filter, Product, PaginationParams, PaginatedResponse } from "./product-types";

export class ProductService {
    async createProduct(product: Product) {
        const newProduct = new productModel(product);
        return newProduct.save();
    }

    async getProducts(
        q: string, 
        filters: Filter, 
        pagination: PaginationParams
    ): Promise<PaginatedResponse<Product>> {
        const matchQuery: Record<string, unknown> = {
            ...filters
        };
        
        if (q && q.trim() !== "") {
            const searchQueryRegexp = new RegExp(q, "i");
            matchQuery.name = searchQueryRegexp;
        }
        
        // Get total count for pagination metadata
        const countAggregate = productModel.aggregate([
            {
                $match: matchQuery
            },
            {
                $count: "total"
            }
        ]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const countResult = await countAggregate.exec();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const total = (countResult[0] as { total?: number })?.total ?? 0;

        // Calculate pagination
        const skip = (pagination.page - 1) * pagination.limit;
        const totalPages = Math.ceil(total / pagination.limit);

        // Get paginated results
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
            },
            {
                $skip: skip
            },
            {
                $limit: pagination.limit
            }
        ]);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = await aggregate.exec();
        
        return {
            data: result as Product[],
            pagination: {
                page: pagination.page,
                limit: pagination.limit,
                total,
                totalPages,
                hasNextPage: pagination.page < totalPages,
                hasPrevPage: pagination.page > 1
            }
        };
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