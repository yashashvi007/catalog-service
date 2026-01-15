import mongoose, { Model, Schema } from "mongoose";
import { Product } from "./product-types";

const attributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

const priceConfigurationSchema = new mongoose.Schema({
    priceType: {
        type: String,
        enum: ["base", "additional"]
    },
    availableOptions: {
        type: Map,
        of: Number
    }
})

// Workaround for TS2590: Helper function to prevent complex type inference
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Schema definition types cause TS2590
function createSchema(definition: any, options?: mongoose.SchemaOptions): Schema {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/ban-ts-comment -- TS2590 requires bypassing type checking
    // @ts-ignore TS2590: Complex union type from nested Map schema - type assertion needed
    const schemaResult: unknown = new mongoose.Schema(definition, options);
    return schemaResult as Schema;
}

const productSchema = createSchema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    priceConfiguration: {
        type: Map,
        of: priceConfigurationSchema
    },
    attributes: [attributeSchema],
    tenantId: {
        type: Number,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    isPublished: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// Workaround for TS2590: Explicitly type as unknown to prevent complex type inference
const modelResult: unknown = mongoose.model("Product", productSchema);
const ProductModel = modelResult as Model<Product>;
export default ProductModel;