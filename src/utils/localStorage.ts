import { FormSchema } from '../types/formTypes';

const STORAGE_KEY = 'dynamic-form-builder-forms';

export const saveForms = (forms: FormSchema[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error('Error saving forms to localStorage:', error);
  }
};

export const loadForms = (): FormSchema[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading forms from localStorage:', error);
    return [];
  }
};

export const saveForm = (form: FormSchema): FormSchema[] => {
  const forms = loadForms();
  const existingIndex = forms.findIndex(f => f.id === form.id);
  
  if (existingIndex >= 0) {
    forms[existingIndex] = form;
  } else {
    forms.push(form);
  }
  
  saveForms(forms);
  return forms;
};

export const deleteForm = (formId: string): FormSchema[] => {
  const forms = loadForms();
  const updatedForms = forms.filter(f => f.id !== formId);
  saveForms(updatedForms);
  return updatedForms;
};