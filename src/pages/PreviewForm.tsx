import React, { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Paper
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { updateFormData, validateCurrentForm } from '../store/formSlice';
import FieldRenderer from '../components/FormBuilder/FieldRenderer';

const PreviewForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm, formData, errors } = useSelector((state: RootState) => state.form);

  useEffect(() => {
    if (currentForm) {
      dispatch(validateCurrentForm());
    }
  }, [currentForm, formData, dispatch]);

  const handleFieldChange = (fieldId: string, value: any) => {
    dispatch(updateFormData({ fieldId, value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(validateCurrentForm());
    
    if (Object.keys(errors).length === 0) {
      alert('Form submitted successfully! In a real application, this would send data to a server.');
    }
  };

  if (!currentForm) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No form available for preview. Please create a form first.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/create')}
        >
          Go to Form Builder
        </Button>
      </Container>
    );
  }

  if (currentForm.fields.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          The form is empty. Please add some fields first.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/create')}
        >
          Go to Form Builder
        </Button>
      </Container>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/create')}
          sx={{ mr: 2 }}
        >
          Back to Builder
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Form Preview
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 1, mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          This is how your form will appear to users
        </Typography>
      </Paper>

      <Card sx={{ background: 'var(--gradient-card)', boxShadow: 'var(--shadow-lg)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {currentForm.name}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {currentForm.fields.map((field) => (
                <FieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={errors[field.id]}
                />
              ))}
            </Box>

            {hasErrors && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Please fix the errors above before submitting.
              </Alert>
            )}

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/create')}
              >
                Edit Form
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={hasErrors}
                sx={{ 
                  minWidth: 120,
                  background: hasErrors ? undefined : 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))'
                }}
              >
                Submit Form
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Form Data Debug (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card sx={{ mt: 3, bgcolor: 'grey.100' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Debug: Form Data</Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify({ formData, errors }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PreviewForm;