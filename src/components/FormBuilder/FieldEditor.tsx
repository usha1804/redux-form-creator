import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { FormField, FieldType, SelectOption, ValidationRule, DerivedField } from '../../types/formTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface FieldEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
  field?: FormField | null;
}

const fieldTypeOptions: { value: FieldType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' }
];

const FieldEditor: React.FC<FieldEditorProps> = ({ open, onClose, onSave, field }) => {
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const [formData, setFormData] = useState<{
    type: FieldType;
    label: string;
    placeholder: string;
    defaultValue: string;
    validations: ValidationRule;
    options: SelectOption[];
    derived: DerivedField | null;
  }>({
    type: 'text',
    label: '',
    placeholder: '',
    defaultValue: '',
    validations: {},
    options: [],
    derived: null
  });

  const [newOption, setNewOption] = useState({ value: '', label: '' });

  useEffect(() => {
    if (field) {
      setFormData({
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || '',
        defaultValue: field.defaultValue || '',
        validations: field.validations,
        options: field.options || [],
        derived: field.derived || null
      });
    } else {
      setFormData({
        type: 'text',
        label: '',
        placeholder: '',
        defaultValue: '',
        validations: {},
        options: [],
        derived: null
      });
    }
  }, [field, open]);

  const handleSave = () => {
    const newField: FormField = {
      id: field?.id || `field_${Date.now()}`,
      type: formData.type,
      label: formData.label,
      placeholder: formData.placeholder || undefined,
      defaultValue: formData.defaultValue || undefined,
      validations: formData.validations,
      options: ['select', 'radio'].includes(formData.type) ? formData.options : undefined,
      derived: formData.derived || undefined
    };

    onSave(newField);
    onClose();
  };

  const addOption = () => {
    if (newOption.value && newOption.label) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { ...newOption }]
      }));
      setNewOption({ value: '', label: '' });
    }
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const availableParentFields = currentForm?.fields.filter(f => 
    f.id !== field?.id && !f.derived
  ) || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {field ? 'Edit Field' : 'Add New Field'}
      </DialogTitle>
      
      <DialogContent dividers sx={{ minHeight: 400 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel>Field Type</InputLabel>
              <Select
                value={formData.type}
                label="Field Type"
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as FieldType }))}
              >
                {fieldTypeOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Placeholder"
              value={formData.placeholder}
              onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Default Value"
              value={formData.defaultValue}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
            />
          </Box>

          {/* Options for Select/Radio fields */}
          {['select', 'radio'].includes(formData.type) && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.options.map((option, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={`${option.label} (${option.value})`} />
                      <IconButton size="small" onClick={() => removeOption(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <TextField
                      size="small"
                      label="Option Value"
                      value={newOption.value}
                      onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                    />
                    <TextField
                      size="small"
                      label="Option Label"
                      value={newOption.label}
                      onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={addOption}
                      disabled={!newOption.value || !newOption.label}
                    >
                      Add
                    </Button>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Validation Rules */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Validation Rules</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formData.validations.required}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        validations: { ...prev.validations, required: e.target.checked }
                      }))}
                    />
                  }
                  label="Required"
                />

                {formData.type === 'text' && (
                  <>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!formData.validations.email}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            validations: { ...prev.validations, email: e.target.checked }
                          }))}
                        />
                      }
                      label="Email Format"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={!!formData.validations.passwordRule}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            validations: { ...prev.validations, passwordRule: e.target.checked }
                          }))}
                        />
                      }
                      label="Password Rules (8+ chars, 1+ number)"
                    />
                  </>
                )}

                <TextField
                  type="number"
                  label="Min Length"
                  value={formData.validations.minLength || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    validations: { ...prev.validations, minLength: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                />

                <TextField
                  type="number"
                  label="Max Length"
                  value={formData.validations.maxLength || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    validations: { ...prev.validations, maxLength: e.target.value ? Number(e.target.value) : undefined }
                  }))}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Derived Field Configuration */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Derived Field (Optional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formData.derived}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        derived: e.target.checked ? { parentFieldIds: [], formula: '' } : null
                      }))}
                    />
                  }
                  label="Make this a derived field"
                />

                {formData.derived && (
                  <>
                    <Autocomplete
                      multiple
                      options={availableParentFields}
                      getOptionLabel={(field) => field.label}
                      value={availableParentFields.filter(f => 
                        formData.derived?.parentFieldIds.includes(f.id)
                      )}
                      onChange={(_, selectedFields) => setFormData(prev => ({
                        ...prev,
                        derived: prev.derived ? {
                          ...prev.derived,
                          parentFieldIds: selectedFields.map(f => f.id)
                        } : null
                      }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Parent Fields"
                          placeholder="Select parent fields"
                        />
                      )}
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Formula"
                      placeholder="Example: currentYear - new Date(field_123).getFullYear()"
                      value={formData.derived.formula}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        derived: prev.derived ? {
                          ...prev.derived,
                          formula: e.target.value
                        } : null
                      }))}
                      helperText="Use JavaScript expressions. Parent field IDs can be used as variables."
                    />
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSave}
          variant="contained"
          disabled={!formData.label}
        >
          {field ? 'Update' : 'Add'} Field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;