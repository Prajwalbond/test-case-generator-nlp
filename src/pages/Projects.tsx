
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, FileText, Folder, FolderPlus, Plus, Search } from 'lucide-react';
import Layout from '@/components/Layout';
import { Project } from '@/types';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addProject } = useTestCases();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState<{name: string; description: string}>({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProject = () => {
    if (newProject.name.trim() === '') {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addProject(project);
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
    
    toast({
      title: "Project Created",
      description: `${newProject.name} has been created successfully.`,
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
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Enter the details to create a new project. Projects can contain multiple PRDs and transcripts.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="project-name" className="text-sm font-medium">Project Name</label>
                    <Input 
                      id="project-name"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="project-description" className="text-sm font-medium">Description</label>
                    <Textarea 
                      id="project-description"
                      value={newProject.description}
                      onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateProject}>Create Project</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
              <Folder className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No projects found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                {searchTerm ? 'Try a different search term or clear your search' : 'Create your first project to get started with test case generation'}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl truncate">{project.name}</CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarDays className="mr-1 h-4 w-4" />
                        Created: {formatDate(project.createdAt)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="mr-1 h-4 w-4" />
                        Documents: {project.documents.length}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      View Project
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
