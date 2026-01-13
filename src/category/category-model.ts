import mongoose, { Model } from "mongoose";
import { Category } from "./category-types";

// Workaround for TS2590: Prevent complex type inference
const priceConfigurationSchema = new mongoose.Schema(
    {
        priceType: {
            type: String,
            enum: ["base", "additional"],
            required: true,
        },
        availableOptions: {
            type: [String],
            required: true,
        },
    },
    { _id: false },
);

// Workaround for TS2590: Prevent complex type inference
const attributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        widgetType: {
            type: String,
            enum: ["switch", "radio"],
            required: true,
        },
        defaultValue: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        availableOptions: {
            type: [String],
            required: true,
        },
    },
    { _id: false },
);

// Workaround for TS2590: Prevent complex type inference
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema,
        required: true,
    },
    attributes: {
        type: [attributeSchema],
        required: true,
    },
}, { timestamps: true });

// Workaround for TS2590: Explicitly type as unknown to prevent complex type inference
const modelResult: unknown = mongoose.model("Category", categorySchema);
const CategoryModel = modelResult as Model<Category>;
export default CategoryModel;