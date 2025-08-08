import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Save as SaveIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveCurrentForm,
  createNewForm
} from '../store/formSlice';
import FieldEditor from '../components/FormBuilder/FieldEditor';
import { FormField } from '../types/formTypes';

interface SortableFieldProps {
  field: FormField;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableField: React.FC<SortableFieldProps> = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const getFieldTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'primary',
      number: 'secondary',
      textarea: 'info',
      select: 'success',
      radio: 'warning',
      checkbox: 'error',
      date: 'default'
    };
    return colors[type] as any || 'default';
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: 'background.paper',
        mb: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover'
        }
      }}
    >
      <IconButton {...attributes} {...listeners} size="small" sx={{ mr: 1 }}>
        <DragIcon />
      </IconButton>
      
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1">{field.label}</Typography>
            <Chip
              label={field.type}
              size="small"
              color={getFieldTypeColor(field.type)}
            />
            {field.derived && (
              <Chip label="Derived" size="small" variant="outlined" color="secondary" />
            )}
            {field.validations.required && (
              <Chip label="Required" size="small" variant="outlined" color="error" />
            )}
          </Box>
        }
        secondary={field.placeholder || `${field.type} field`}
      />
      
      <ListItemSecondaryAction>
        <IconButton onClick={onEdit} size="small" sx={{ mr: 1 }}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onDelete} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const CreateForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentForm } = useSelector((state: RootState) => state.form);
  
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formName, setFormName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    if (!currentForm) {
      // Create a new form
      dispatch(createNewForm('Untitled Form'));
    }
  }, [currentForm, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && currentForm) {
      const oldIndex = currentForm.fields.findIndex(field => field.id === active.id);
      const newIndex = currentForm.fields.findIndex(field => field.id === over.id);

      dispatch(reorderFields({ fromIndex: oldIndex, toIndex: newIndex }));
    }
  };

  const handleAddField = (field: FormField) => {
    dispatch(addField(field));
  };

  const handleUpdateField = (field: FormField) => {
    dispatch(updateField({ fieldId: field.id, updates: field }));
  };

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId));
  };

  const openFieldEditor = (field?: FormField) => {
    setEditingField(field || null);
    setFieldEditorOpen(true);
  };

  const handleSaveForm = () => {
    if (currentForm && formName.trim()) {
      const updatedForm = { ...currentForm, name: formName.trim() };
      dispatch(updateField({ fieldId: 'form', updates: { name: formName.trim() } as any }));
      dispatch(saveCurrentForm());
      setSaveDialogOpen(false);
      setFormName('');
    }
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  if (!currentForm) {
    return (
      <Container>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Form Builder
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PreviewIcon />}
            onClick={handlePreview}
            disabled={currentForm.fields.length === 0}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => {
              setFormName(currentForm.name);
              setSaveDialogOpen(true);
            }}
            disabled={currentForm.fields.length === 0}
            sx={{ background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))' }}
          >
            Save Form
          </Button>
        </Box>
      </Box>

      {currentForm.fields.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 6, background: 'var(--gradient-card)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Your form is empty
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }} color="text.secondary">
              Add your first field to get started building your form
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => openFieldEditor()}
              sx={{ background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))' }}
            >
              Add First Field
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ background: 'var(--gradient-card)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Form Fields</Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => openFieldEditor()}
                sx={{ background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))' }}
              >
                Add Field
              </Button>
            </Box>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentForm.fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <List>
                  {currentForm.fields.map((field) => (
                    <SortableField
                      key={field.id}
                      field={field}
                      onEdit={() => openFieldEditor(field)}
                      onDelete={() => handleDeleteField(field.id)}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </CardContent>
        </Card>
      )}

      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, hsl(225, 84%, 55%), hsl(280, 60%, 60%))'
        }}
        onClick={() => openFieldEditor()}
      >
        <AddIcon />
      </Fab>

      <FieldEditor
        open={fieldEditorOpen}
        onClose={() => {
          setFieldEditorOpen(false);
          setEditingField(null);
        }}
        onSave={editingField ? handleUpdateField : handleAddField}
        field={editingField}
      />

      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter a name for your form"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveForm}
            variant="contained"
            disabled={!formName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateForm;