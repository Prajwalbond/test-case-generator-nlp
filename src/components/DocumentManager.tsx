
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document, Project } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileUp, MoreVertical, Plus, Trash, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DocumentViewer from './DocumentViewer';

interface DocumentManagerProps {
  project: Project;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ project }) => {
  const { updateProject } = useTestCases();
  const { toast } = useToast();
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentsToUpload, setDocumentsToUpload] = useState<{ file: File; type: 'PRD' | 'Transcript' }[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newDocuments = files.map(file => ({
        file,
        type: 'PRD' as const
      }));
      
      setDocumentsToUpload([...documentsToUpload, ...newDocuments]);
    }
  };
  
  const handleTypeChange = (index: number, type: 'PRD' | 'Transcript') => {
    const updatedDocs = [...documentsToUpload];
    updatedDocs[index].type = type;
    setDocumentsToUpload(updatedDocs);
  };
  
  const handleRemoveUpload = (index: number) => {
    const updatedDocs = [...documentsToUpload];
    updatedDocs.splice(index, 1);
    setDocumentsToUpload(updatedDocs);
  };
  
  const handleUpload = () => {
    if (documentsToUpload.length === 0) {
      toast({
        title: "No documents",
        description: "Please select at least one document to upload",
        variant: "destructive"
      });
      return;
    }
    
    // Create new document objects
    const newDocuments = documentsToUpload.map(doc => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: doc.file.name,
      type: doc.type,
      uploadDate: new Date(),
      content: "This is a placeholder for the actual document content. In a real application, this would contain the full text of the uploaded document."
    }));
    
    // Update project
    updateProject(project.id, {
      documents: [...project.documents, ...newDocuments],
      updatedAt: new Date()
    });
    
    setDocumentsToUpload([]);
    setIsUploadDialogOpen(false);
    
    toast({
      title: "Documents uploaded",
      description: `Successfully uploaded ${newDocuments.length} document(s).`
    });
  };
  
  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };
  
  const handleDownloadDocument = (doc: Document) => {
    // In a real app, this would use the document's actual content or a server URL
    const content = doc.content || "Placeholder content for " + doc.name;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Downloading ${doc.name}`
    });
  };
  
  const handleDeleteDocument = () => {
    if (!selectedDocument) return;
    
    // Update project documents
    updateProject(project.id, {
      documents: project.documents.filter(doc => doc.id !== selectedDocument.id),
      updatedAt: new Date()
    });
    
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Document deleted",
      description: `${selectedDocument.name} has been deleted.`
    });
  };
  
  const prepareForDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Documents</h3>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Documents
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
              <DialogDescription>
                Upload PRDs or transcripts to this project. You can upload multiple files at once.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1"
                />
              </div>
              
              {documentsToUpload.length > 0 && (
                <div className="border rounded-md p-4 space-y-2 max-h-64 overflow-y-auto">
                  {documentsToUpload.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="truncate flex-1">{doc.file.name}</div>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={doc.type} 
                          onValueChange={(value: 'PRD' | 'Transcript') => handleTypeChange(index, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRD">PRD</SelectItem>
                            <SelectItem value="Transcript">Transcript</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveUpload(index)}
                          className="h-9 w-9 text-red-500 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpload}>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {project.documents.length === 0 ? (
        <div className="text-center py-6 border border-dashed rounded-md">
          <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No documents uploaded yet</p>
          <Button className="mt-4" size="sm" onClick={() => setIsUploadDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Documents
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {project.documents.map((doc) => (
              <li key={doc.id} className="py-3 px-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleViewDocument(doc)}
                >
                  {doc.type === 'PRD' ? (
                    <FileText className="h-5 w-5 text-blue-500 mr-3" />
                  ) : (
                    <FileUp className="h-5 w-5 text-green-500 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium hover:underline">{doc.name}</p>
                    <p className="text-xs text-gray-500">
                      {doc.type} • Uploaded on {formatDate(doc.uploadDate)}
                    </p>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDownloadDocument(doc)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => prepareForDelete(doc)}
                      className="text-red-500 focus:text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Document viewer dialog */}
      <DocumentViewer 
        document={selectedDocument} 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
      />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentManager;
