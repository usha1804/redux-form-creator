import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as FormIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import {
  loadFormsFromLocalStorage,
  setCurrentForm,
  deleteFormFromStorage,
  createNewForm
} from '../store/formSlice';
import { deleteForm } from '../utils/localStorage';
import { FormSchema } from '../types/formTypes';

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedForms } = useSelector((state: RootState) => state.form);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<FormSchema | null>(null);

  useEffect(() => {
    dispatch(loadFormsFromLocalStorage());
  }, [dispatch]);

  const handleCreateNew = () => {
    dispatch(createNewForm('New Form'));
    navigate('/create');
  };

  const handlePreviewForm = (form: FormSchema) => {
    dispatch(setCurrentForm(form));
    navigate('/preview');
  };

  const handleEditForm = (form: FormSchema) => {
    dispatch(setCurrentForm(form));
    navigate('/create');
  };

  const handleDeleteForm = (form: FormSchema) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (formToDelete) {
      deleteForm(formToDelete.id);
      dispatch(deleteFormFromStorage(formToDelete.id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFieldTypeCounts = (form: FormSchema) => {
    const counts: Record<string, number> = {};
    form.fields.forEach(field => {
      counts[field.type] = (counts[field.type] || 0) + 1;
    });
    return counts;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          My Forms
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          size="large"
          sx={{ background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))' }}
        >
          Create New Form
        </Button>
      </Box>

      {savedForms.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, background: 'var(--gradient-card)' }}>
          <CardContent>
            <FormIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="text.secondary">
              No forms created yet
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
              Create your first form to get started with the form builder
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={handleCreateNew}
              sx={{ background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))' }}
            >
              Create First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 'var(--shadow-md)',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
                  Form Name
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
                  Fields
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
                  Field Types
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }}>
                  Created
                </TableCell>
                <TableCell sx={{ color: 'primary.contrastText', fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedForms.map((form) => {
                const fieldCounts = getFieldTypeCounts(form);
                
                return (
                  <TableRow 
                    key={form.id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handlePreviewForm(form)}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {form.name}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={`${form.fields.length} fields`}
                        size="small"
                        color={form.fields.length > 0 ? 'primary' : 'default'}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {Object.entries(fieldCounts).map(([type, count]) => (
                          <Chip
                            key={type}
                            label={`${type} (${count})`}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(form.createdAt)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right" onClick={e => e.stopPropagation()}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handlePreviewForm(form)}
                        title="Preview Form"
                      >
                        <PreviewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="secondary"
                        onClick={() => handleEditForm(form)}
                        title="Edit Form"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteForm(form)}
                        title="Delete Form"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyForms;