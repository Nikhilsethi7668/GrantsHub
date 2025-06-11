import { body } from "express-validator";

export const businessValidationRules = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
    .trim(),
    
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
    .trim(),

  // Include your other validations here (email, etc.)
  body('email')
    .isEmail().withMessage('Must be a valid email')
    .normalizeEmail(),


  body('founderDemographics')
    .isArray().withMessage('Must be an array')
    .custom((value) => {
      const validOptions = ["Black", "Female", "LGBTQ+", "Youth", "Veteran", "Newcomer"];
      return value.every(item => validOptions.includes(item));
    }).withMessage('Invalid founder demographic selected'),
    
];

export const editBusinessValidationRules = [
  body('firstName')
    .optional()
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
    .trim(),
    
  body('lastName')
    .optional()
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
    .trim()
];

