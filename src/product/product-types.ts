import mongoose from "mongoose";
import { PriceConfiguration } from "../category/category-types";

export interface Product {
    name: string;
    description: string;
    image: string;
    priceConfiguration: PriceConfiguration;
    attributes: string[];
    tenantId: string;
    categoryId: string;
    isPublished: boolean;
}

export interface Filter {
    tenantId?: number;
    categoryId?: mongoose.Types.ObjectId;
    isPublished?: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}