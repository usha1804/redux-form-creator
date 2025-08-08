export type FieldType = 
  | 'text' 
  | 'number' 
  | 'textarea' 
  | 'select' 
  | 'radio' 
  | 'checkbox' 
  | 'date';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  passwordRule?: boolean; // min 8 chars, at least one number
}

export interface DerivedField {
  parentFieldIds: string[];
  formula: string; // JavaScript expression
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  defaultValue?: any;
  validations: ValidationRule;
  derived?: DerivedField;
  options?: SelectOption[]; // for select/radio fields
  placeholder?: string;
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FormField[];
}

export interface FormState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  formData: Record<string, any>; // current form input values
  errors: Record<string, string>; // field validation errors
}

export interface FieldError {
  fieldId: string;
  message: string;
}