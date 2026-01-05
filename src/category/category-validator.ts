import { body } from "express-validator";

export default [
    body('name')
      .exists()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string'),
    body('priceConfiguration')
      .exists()
      .withMessage('Price configuration is required'),
    body('priceConfiguration.*.priceType')
      .exists()
      .withMessage('Price type is required')
      .custom((value: "base" | "additional") => {
        const validKeys = ['base', 'additional'];
        if(!validKeys.includes(value)) {
            throw new Error(`${value} is invalid attribute for priceType field. Possible valid keys are [${validKeys.join(',')}]`)
        }
      }),
    body('priceConfiguration.*.availableOptions')
      .exists()
      .withMessage('Available options are required')
      .isArray()
      .withMessage('Available options must be an array'),
]