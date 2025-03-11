
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarDays, Edit, FileText, MoreVertical, Trash } from 'lucide-react';
import { Project } from '@/types';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const navigate = useNavigate();
  const { updateProject, deleteProject, getTestCasesByProjectId } = useTestCases();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editProject, setEditProject] = useState({
    name: project.name,
    description: project.description
  });
  
  const testCases = getTestCasesByProjectId(project.id);
  
  const handleSaveEdit = () => {
    if (editProject.name.trim() === '') {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    updateProject(project.id, {
      name: editProject.name,
      description: editProject.description,
      updatedAt: new Date()
    });
    
    setIsEditDialogOpen(false);
    
    toast({
      title: "Project Updated",
      description: "Project details have been updated successfully.",
    });
  };
  
  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate('/projects');
    
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully.",
    });
  };
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{project.description}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              Created: {formatDate(project.createdAt)}
            </span>
            <span className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Documents: {project.documents.length}
            </span>
            <span className="flex items-center">
              <Badge variant="outline">
                Test Cases: {testCases.length}
              </Badge>
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-500 focus:text-red-500 hover:text-red-700"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-project-name" className="text-sm font-medium">Project Name</label>
              <Input 
                id="edit-project-name"
                value={editProject.name}
                onChange={(e) => setEditProject({...editProject, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-project-description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="edit-project-description"
                value={editProject.description}
                onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Project Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
              All test cases associated with this project will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-red-500 text-white hover:bg-red-600">
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectHeader;
