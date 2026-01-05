import { body } from "express-validator";

export default [
    body('name')
      .exists()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name must be a string'),
    body('priceConfiguration')
      .exists()
      .withMessage('Price configuration is required')
      .isObject()
      .withMessage('Price configuration must be an object')
      .custom((value: Record<string, unknown>) => {
        if (Object.keys(value).length === 0) {
          throw new Error('Price configuration cannot be empty');
        }
        return true;
      }),
    body('priceConfiguration.*.priceType')
      .exists()
      .withMessage('Price type is required')
      .isString()
      .withMessage('Price type must be a string')
      .custom((value: string) => {
        const validKeys = ['base', 'additional'];
        if(!validKeys.includes(value)) {
            throw new Error(`${value} is invalid attribute for priceType field. Possible valid keys are [${validKeys.join(',')}]`)
        }
        return true;
      }),
    body('priceConfiguration.*.availableOptions')
      .exists()
      .withMessage('Available options are required')
      .isArray()
      .withMessage('Available options must be an array')
      .notEmpty()
      .withMessage('Available options cannot be empty'),
    body('attributes')
      .exists()
      .withMessage('Attributes are required')
      .isArray()
      .withMessage('Attributes must be an array'),
    body('attributes.*.name')
      .exists()
      .withMessage('Attribute name is required')
      .isString()
      .withMessage('Attribute name must be a string'),
    body('attributes.*.widgetType')
      .exists()
      .withMessage('Widget type is required')
      .isIn(['switch', 'radio'])
      .withMessage('Widget type must be either "switch" or "radio"'),
    body('attributes.*.defaultValue')
      .exists()
      .withMessage('Default value is required'),
    body('attributes.*.availableOptions')
      .exists()
      .withMessage('Attribute available options are required')
      .isArray()
      .withMessage('Attribute available options must be an array')
      .notEmpty()
      .withMessage('Attribute available options cannot be empty'),
]