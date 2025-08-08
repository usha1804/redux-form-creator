import { ValidationRule, FormField } from '../types/formTypes';

export const validateField = (
  field: FormField,
  value: any,
  allFormData?: Record<string, any>
): string | null => {
  const { validations } = field;
  
  // Skip validation for derived fields
  if (field.derived) {
    return null;
  }

  // Required validation
  if (validations.required) {
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      return `${field.label} is required`;
    }
  }

  // If field is empty and not required, skip other validations
  if (!value && !validations.required) {
    return null;
  }

  const stringValue = String(value);

  // Min length validation
  if (validations.minLength && stringValue.length < validations.minLength) {
    return `${field.label} must be at least ${validations.minLength} characters`;
  }

  // Max length validation
  if (validations.maxLength && stringValue.length > validations.maxLength) {
    return `${field.label} must not exceed ${validations.maxLength} characters`;
  }

  // Email validation
  if (validations.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(stringValue)) {
      return `${field.label} must be a valid email address`;
    }
  }

  // Password validation
  if (validations.passwordRule) {
    if (stringValue.length < 8) {
      return `${field.label} must be at least 8 characters long`;
    }
    if (!/\d/.test(stringValue)) {
      return `${field.label} must contain at least one number`;
    }
  }

  return null;
};

export const validateForm = (
  fields: FormField[],
  formData: Record<string, any>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  fields.forEach(field => {
    const error = validateField(field, formData[field.id], formData);
    if (error) {
      errors[field.id] = error;
    }
  });

  return errors;
};

export const calculateDerivedValue = (
  field: FormField,
  formData: Record<string, any>
): any => {
  if (!field.derived) return undefined;

  try {
    // Create a safe evaluation context
    const context: Record<string, any> = {};
    
    field.derived.parentFieldIds.forEach(parentId => {
      const parentValue = formData[parentId];
      context[parentId] = parentValue;
      
      // Also make available as more readable variable names
      const parentField = field.derived?.parentFieldIds.find(id => id === parentId);
      if (parentField) {
        // Use field ID as variable name for formulas
        context[parentId.replace(/[^a-zA-Z0-9]/g, '_')] = parentValue;
      }
    });

    // Add some utility functions
    context.currentYear = new Date().getFullYear();
    context.today = new Date();
    context.Math = Math;
    context.Date = Date;

    // Simple formula evaluation - in production, use a safer parser
    const formula = field.derived.formula;
    
    // Replace field IDs in formula with their values
    let processedFormula = formula;
    field.derived.parentFieldIds.forEach(parentId => {
      const value = formData[parentId];
      processedFormula = processedFormula.replace(
        new RegExp(`\\b${parentId}\\b`, 'g'),
        JSON.stringify(value)
      );
    });

    // Evaluate the formula
    const result = Function(`"use strict"; return (${processedFormula})`)();
    return result;
  } catch (error) {
    console.error('Error calculating derived value:', error);
    return 'Error in formula';
  }
};