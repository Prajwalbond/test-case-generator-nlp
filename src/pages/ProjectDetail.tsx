
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, CalendarDays, Edit, FileText, FileUp, Plus, Trash2, Upload 
} from 'lucide-react';
import Layout from '@/components/Layout';
import TestCaseDetail from '@/components/TestCaseDetail';
import { Document, TestCase, UploadFormData } from '@/types';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    projects, getProjectById, getTestCasesByProjectId, updateProject, 
    deleteProject, addTestCases
  } = useTestCases();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    prdFile: null,
    transcriptFile: null,
    youtrackIds: '',
    projectId: projectId
  });
  
  // Get project details
  const project = projectId ? getProjectById(projectId) : undefined;
  
  // Get test cases for this project
  const projectTestCases = projectId ? getTestCasesByProjectId(projectId) : [];
  
  const [editProject, setEditProject] = useState({
    name: project?.name || '',
    description: project?.description || ''
  });
  
  if (!project) {
    return (
      <Layout>
        <div className="py-10 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="mb-6">The project you are looking for does not exist or has been removed.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const handleSaveEdit = () => {
    if (editProject.name.trim() === '') {
      toast({
        title: "Error",
        description: "Project name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (projectId) {
      updateProject(projectId, {
        name: editProject.name,
        description: editProject.description,
        updatedAt: new Date()
      });
      
      setIsEditDialogOpen(false);
      
      toast({
        title: "Project Updated",
        description: "Project details have been updated successfully.",
      });
    }
  };
  
  const handleDeleteProject = () => {
    if (projectId) {
      deleteProject(projectId);
      navigate('/projects');
      
      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
      });
    }
  };
  
  const handleUploadDocument = () => {
    // In a real application, this would upload the file and process it
    // For now, we'll just add a document to the project
    
    if (!formData.prdFile && !formData.transcriptFile) {
      toast({
        title: "Error",
        description: "Please upload at least one document",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.youtrackIds) {
      toast({
        title: "Error",
        description: "Please enter at least one YouTrack ID",
        variant: "destructive",
      });
      return;
    }
    
    // Process YouTrack IDs
    const youtrackIds = formData.youtrackIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    // Create a new document
    let newDocument: Document | null = null;
    
    if (formData.prdFile) {
      newDocument = {
        id: `doc-${Date.now()}`,
        name: formData.prdFile.name,
        type: 'PRD',
        uploadDate: new Date()
      };
    } else if (formData.transcriptFile) {
      newDocument = {
        id: `doc-${Date.now()}`,
        name: formData.transcriptFile.name,
        type: 'Transcript',
        uploadDate: new Date()
      };
    }
    
    if (newDocument && projectId) {
      // Update the project with the new document
      updateProject(projectId, {
        documents: [...project.documents, newDocument],
        updatedAt: new Date()
      });
      
      // In a real application, we would use nlpService here to generate test cases
      // For now, let's create a dummy test case
      const dummyTestCase: TestCase = {
        id: `tc-${Date.now()}`,
        projectId: projectId,
        summary: `Test case from ${newDocument.name}`,
        linkedUserStories: youtrackIds,
        type: 'Functional',
        status: 'Draft',
        steps: [
          { stepNumber: 1, action: "Sample action", expectedResult: "Sample expected result" }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the test case
      addTestCases([dummyTestCase]);
      
      setIsUploadDialogOpen(false);
      setFormData({
        prdFile: null,
        transcriptFile: null,
        youtrackIds: '',
        projectId: projectId
      });
      
      toast({
        title: "Document Uploaded",
        description: `${newDocument.name} has been uploaded and 1 test case has been generated.`,
      });
    }
  };
  
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'prdFile' | 'transcriptFile'
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fileType]: e.target.files[0],
        // Clear the other file type
        ...(fileType === 'prdFile' ? { transcriptFile: null } : { prdFile: null })
      });
    }
  };
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Group test cases by type
  const testCasesByType = {
    Functional: projectTestCases.filter(tc => tc.type === 'Functional'),
    Performance: projectTestCases.filter(tc => tc.type === 'Performance'),
    Security: projectTestCases.filter(tc => tc.type === 'Security'),
    Accessibility: projectTestCases.filter(tc => tc.type === 'Accessibility')
  };
  
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
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
                    Test Cases: {projectTestCases.length}
                  </Badge>
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </DialogTrigger>
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
                      <Input 
                        id="edit-project-description"
                        value={editProject.description}
                        onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                      Upload a PRD or transcript to generate test cases for this project.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="document-type">Document Type</Label>
                      <Tabs defaultValue="prd" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="prd">PRD</TabsTrigger>
                          <TabsTrigger value="transcript">Transcript</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="prd" className="mt-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="prd-file">PRD File</Label>
                              <Input
                                id="prd-file"
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => handleFileChange(e, 'prdFile')}
                              />
                              <p className="text-sm text-gray-500">
                                {formData.prdFile ? `Selected: ${formData.prdFile.name}` : 'No file selected'}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="transcript" className="mt-4">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="transcript-file">Transcript File</Label>
                              <Input
                                id="transcript-file"
                                type="file"
                                accept=".txt,.doc,.docx,.pdf"
                                onChange={(e) => handleFileChange(e, 'transcriptFile')}
                              />
                              <p className="text-sm text-gray-500">
                                {formData.transcriptFile ? `Selected: ${formData.transcriptFile.name}` : 'No file selected'}
                              </p>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="youtrack-ids">YouTrack IDs (comma-separated)</Label>
                      <Input
                        id="youtrack-ids"
                        placeholder="YT-123, YT-456, YT-789"
                        value={formData.youtrackIds}
                        onChange={(e) => setFormData({...formData, youtrackIds: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleUploadDocument}>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload & Generate
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this project? This action cannot be undone.
                      All test cases associated with this project will also be deleted.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteProject}>Delete Project</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Documents Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Documents</CardTitle>
              <CardDescription>
                PRDs and transcripts uploaded to this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              {project.documents.length === 0 ? (
                <div className="text-center py-4">
                  <FileText className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No documents uploaded yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {project.documents.map((doc) => (
                    <li key={doc.id} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        {doc.type === 'PRD' ? (
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                        ) : (
                          <FileUp className="h-5 w-5 text-green-500 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • Uploaded on {formatDate(doc.uploadDate)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={doc.type === 'PRD' ? 'default' : 'secondary'}>
                        {doc.type}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Document
              </Button>
            </CardFooter>
          </Card>
          
          {/* Test Cases Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Test Cases</h2>
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  View All Test Cases
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  All ({projectTestCases.length})
                </TabsTrigger>
                <TabsTrigger value="functional">
                  Functional ({testCasesByType.Functional.length})
                </TabsTrigger>
                <TabsTrigger value="performance">
                  Performance ({testCasesByType.Performance.length})
                </TabsTrigger>
                <TabsTrigger value="security">
                  Security ({testCasesByType.Security.length})
                </TabsTrigger>
                <TabsTrigger value="accessibility">
                  A11y ({testCasesByType.Accessibility.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                {projectTestCases.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No test cases found. Upload a document to generate test cases.
                    </p>
                    <Button className="mt-4" onClick={() => setIsUploadDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Document
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projectTestCases.map((testCase) => (
                      <TestCaseDetail key={testCase.id} testCase={testCase} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="functional" className="mt-4">
                {testCasesByType.Functional.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No functional test cases found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCasesByType.Functional.map((testCase) => (
                      <TestCaseDetail key={testCase.id} testCase={testCase} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                {testCasesByType.Performance.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No performance test cases found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCasesByType.Performance.map((testCase) => (
                      <TestCaseDetail key={testCase.id} testCase={testCase} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="security" className="mt-4">
                {testCasesByType.Security.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No security test cases found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCasesByType.Security.map((testCase) => (
                      <TestCaseDetail key={testCase.id} testCase={testCase} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="accessibility" className="mt-4">
                {testCasesByType.Accessibility.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">
                      No accessibility test cases found.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testCasesByType.Accessibility.map((testCase) => (
                      <TestCaseDetail key={testCase.id} testCase={testCase} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
