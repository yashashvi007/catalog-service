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
    body("priceConfiguration")
       .exists()
       .withMessage("Price configuration is required")
       .custom((value, { req }) => {
           // Handle both string (from multipart/form-data) and object (from JSON)
           let parsed: unknown;
           if (typeof value === 'string') {
               try {
                   parsed = JSON.parse(value);
               } catch {
                   throw new Error("Price configuration must be valid JSON");
               }
           } else {
               parsed = value;
           }
           
           if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
               throw new Error("Price configuration must be an object");
           }
           
           if (Object.keys(parsed as Record<string, unknown>).length === 0) {
               throw new Error("Price configuration cannot be empty");
           }
           
           // Update req.body with parsed value so controller can use it
           if (typeof value === 'string') {
               (req.body as Record<string, unknown>).priceConfiguration = parsed;
           }
           
           return true;
       }),
    body("attributes")
      .exists()
      .withMessage("Attributes are required")
      .custom((value, { req }) => {
          // Handle both string (from multipart/form-data) and array (from JSON)
          let parsed: unknown;
          if (typeof value === 'string') {
              try {
                  parsed = JSON.parse(value);
              } catch {
                  throw new Error("Attributes must be valid JSON");
              }
          } else {
              parsed = value;
          }
          
          if (!Array.isArray(parsed)) {
              throw new Error("Attributes must be an array");
          }
          
          if (parsed.length === 0) {
              throw new Error("Attributes cannot be empty");
          }
          
          // Update req.body with parsed value so controller can use it
          if (typeof value === 'string') {
              (req.body as Record<string, unknown>).attributes = parsed;
          }
          
          return true;
      }),
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