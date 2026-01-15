import { body } from "express-validator";

export default [
    body("name")
      .exists()
      .withMessage("Product name is required")
      .isString()
      .withMessage("Product name must be a string")
      .trim()
      .notEmpty()
      .withMessage("Product name cannot be empty"),
    body("description")
      .exists()
      .withMessage("Product description is required")
      .isString()
      .withMessage("Product description must be a string")
      .trim()
      .notEmpty()
      .withMessage("Product description cannot be empty"),
    body("image")
      .custom((value, {req})=> {
        if(!req.files) throw new Error("Product image is required");
        return true;
      }),
    body("priceConfiguration")
       .exists()
       .withMessage("Price configuration is required")
       .isObject()
       .withMessage("Price configuration must be an object")
       .notEmpty()
       .withMessage("Price configuration cannot be empty"),
    body("attributes")
      .exists()
      .withMessage("Attributes are required")
      .isArray()
      .withMessage("Attributes must be an array")
      .notEmpty()
      .withMessage("Attributes cannot be empty"),
    body("tenantId")
      .exists()
      .withMessage("Tenant ID is required")
      .isInt()
      .withMessage("Tenant ID must be an integer")
      .notEmpty()
      .withMessage("Tenant ID cannot be empty"),
    body("categoryId")
      .exists()
      .withMessage("Category ID is required")
      .isMongoId()
      .withMessage("Invalid category ID")
      .notEmpty()
      .withMessage("Category ID cannot be empty"),
    body("isPublished")
      .optional()
      .isBoolean()
      .withMessage("Is published must be a boolean")
      .notEmpty()
      .withMessage("Is published cannot be empty"),
]