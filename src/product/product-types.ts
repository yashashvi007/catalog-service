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