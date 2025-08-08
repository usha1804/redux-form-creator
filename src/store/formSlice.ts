import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSchema, FormField, FormState } from '../types/formTypes';
import { loadForms, saveForm } from '../utils/localStorage';
import { validateForm, calculateDerivedValue } from '../utils/validation';

const initialState: FormState = {
  currentForm: null,
  savedForms: [],
  formData: {},
  errors: {}
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<FormSchema | null>) => {
      state.currentForm = action.payload;
      state.formData = {};
      state.errors = {};
      
      // Initialize form data with default values
      if (action.payload) {
        action.payload.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            state.formData[field.id] = field.defaultValue;
          }
        });
        
        // Calculate initial derived values
        action.payload.fields.forEach(field => {
          if (field.derived) {
            state.formData[field.id] = calculateDerivedValue(field, state.formData);
          }
        });
      }
    },

    createNewForm: (state, action: PayloadAction<string>) => {
      const newForm: FormSchema = {
        id: `form_${Date.now()}`,
        name: action.payload,
        createdAt: new Date().toISOString(),
        fields: []
      };
      state.currentForm = newForm;
      state.formData = {};
      state.errors = {};
    },

    addField: (state, action: PayloadAction<FormField>) => {
      if (state.currentForm) {
        state.currentForm.fields.push(action.payload);
      }
    },

    updateField: (state, action: PayloadAction<{ fieldId: string; updates: Partial<FormField> }>) => {
      if (state.currentForm) {
        const fieldIndex = state.currentForm.fields.findIndex(f => f.id === action.payload.fieldId);
        if (fieldIndex >= 0) {
          state.currentForm.fields[fieldIndex] = {
            ...state.currentForm.fields[fieldIndex],
            ...action.payload.updates
          };
        }
      }
    },

    deleteField: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.fields = state.currentForm.fields.filter(f => f.id !== action.payload);
        delete state.formData[action.payload];
        delete state.errors[action.payload];
      }
    },

    reorderFields: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      if (state.currentForm) {
        const { fromIndex, toIndex } = action.payload;
        const fields = [...state.currentForm.fields];
        const [moved] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, moved);
        state.currentForm.fields = fields;
      }
    },

    updateFormData: (state, action: PayloadAction<{ fieldId: string; value: any }>) => {
      const { fieldId, value } = action.payload;
      state.formData[fieldId] = value;

      // Recalculate derived fields that depend on this field
      if (state.currentForm) {
        state.currentForm.fields.forEach(field => {
          if (field.derived && field.derived.parentFieldIds.includes(fieldId)) {
            state.formData[field.id] = calculateDerivedValue(field, state.formData);
          }
        });

        // Validate the updated field
        const field = state.currentForm.fields.find(f => f.id === fieldId);
        if (field) {
          const errors = validateForm([field], state.formData);
          if (errors[fieldId]) {
            state.errors[fieldId] = errors[fieldId];
          } else {
            delete state.errors[fieldId];
          }
        }
      }
    },

    validateCurrentForm: (state) => {
      if (state.currentForm) {
        state.errors = validateForm(state.currentForm.fields, state.formData);
      }
    },

    saveCurrentForm: (state) => {
      if (state.currentForm) {
        const updatedForms = saveForm(state.currentForm);
        state.savedForms = updatedForms;
      }
    },

    loadFormsFromLocalStorage: (state) => {
      state.savedForms = loadForms();
    },

    deleteFormFromStorage: (state, action: PayloadAction<string>) => {
      state.savedForms = state.savedForms.filter(f => f.id !== action.payload);
    }
  }
});

export const {
  setCurrentForm,
  createNewForm,
  addField,
  updateField,
  deleteField,
  reorderFields,
  updateFormData,
  validateCurrentForm,
  saveCurrentForm,
  loadFormsFromLocalStorage,
  deleteFormFromStorage
} = formSlice.actions;

export default formSlice.reducer;