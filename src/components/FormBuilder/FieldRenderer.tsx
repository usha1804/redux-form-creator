import React from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  FormHelperText,
  Box,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormField } from '../../types/formTypes';

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
  disabled?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  onChange,
  error,
  disabled = false
}) => {
  const commonProps = {
    fullWidth: true,
    margin: 'normal' as const,
    error: !!error,
    helperText: error,
    disabled: disabled || !!field.derived
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            type={field.validations.email ? 'email' : field.validations.passwordRule ? 'password' : 'text'}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            type="number"
            value={value || ''}
            onChange={(e) => onChange(Number(e.target.value))}
            placeholder={field.placeholder}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            label={field.label}
            multiline
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value || ''}
              label={field.label}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...commonProps} component="fieldset">
            <FormLabel component="legend">{field.label}</FormLabel>
            <RadioGroup
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <Box sx={{ mt: 2, mb: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!value}
                  onChange={(e) => onChange(e.target.checked)}
                  disabled={disabled || !!field.derived}
                />
              }
              label={field.label}
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
          </Box>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={value ? new Date(value) : null}
              onChange={(newValue) => onChange(newValue ? newValue.toISOString().split('T')[0] : '')}
              slotProps={{
                textField: {
                  ...commonProps,
                  error: !!error,
                  helperText: error
                }
              }}
            />
          </LocalizationProvider>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {field.derived && (
        <Chip
          label="Derived Field"
          size="small"
          color="secondary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}
      {renderField()}
    </Box>
  );
};

export default FieldRenderer;