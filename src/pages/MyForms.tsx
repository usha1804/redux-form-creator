import React, { useEffect, useState } from 'react';
import { Plus, Eye, Edit, Trash2, FileText, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          My Forms
        </h1>
        <Button
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Form
        </Button>
      </div>

      {savedForms.length === 0 ? (
        <Card className="text-center py-12 bg-gradient-to-br from-muted/30 to-muted/10">
          <CardContent className="space-y-6">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/60" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-muted-foreground">
                No forms created yet
              </h3>
              <p className="text-muted-foreground/80">
                Create your first form to get started with the form builder
              </p>
            </div>
            <Button
              onClick={handleCreateNew}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create First Form
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden shadow-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary to-secondary">
                <TableHead className="text-primary-foreground font-semibold">
                  Form Name
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold">
                  Fields
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold">
                  Field Types
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold">
                  Created
                </TableHead>
                <TableHead className="text-primary-foreground font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedForms.map((form) => {
                const fieldCounts = getFieldTypeCounts(form);
                
                return (
                  <TableRow 
                    key={form.id}
                    className="hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handlePreviewForm(form)}
                  >
                    <TableCell>
                      <div className="font-semibold text-foreground">
                        {form.name}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={form.fields.length > 0 ? "default" : "secondary"}
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {form.fields.length} fields
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {Object.entries(fieldCounts).map(([type, count]) => (
                          <Badge
                            key={type}
                            variant="outline"
                            className="text-xs bg-muted/50"
                          >
                            {type} ({count})
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(form.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePreviewForm(form)}
                          className="h-8 w-8 p-0 hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditForm(form)}
                          className="h-8 w-8 p-0 hover:bg-secondary/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteForm(form)}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Form</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{formToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyForms;