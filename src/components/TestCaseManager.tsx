
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TestCase, TestCaseType } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Download, FileDown, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestCaseDetail from './TestCaseDetail';

interface TestCaseManagerProps {
  projectId: string;
}

const TestCaseManager: React.FC<TestCaseManagerProps> = ({ projectId }) => {
  const { getTestCasesByProjectId, selectedTestCases, clearSelectedTestCases, testCases } = useTestCases();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  
  const projectTestCases = getTestCasesByProjectId(projectId);
  
  // Filter test cases based on search term
  const filteredTestCases = projectTestCases.filter(tc => 
    tc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tc.linkedUserStories.some(id => id.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Group test cases by type
  const testCasesByType = {
    Functional: filteredTestCases.filter(tc => tc.type === 'Functional'),
    Performance: filteredTestCases.filter(tc => tc.type === 'Performance'),
    Security: filteredTestCases.filter(tc => tc.type === 'Security'),
    Accessibility: filteredTestCases.filter(tc => tc.type === 'Accessibility')
  };
  
  const anyNotApproved = selectedTestCases.some(id => {
    const tc = testCases.find(t => t.id === id);
    return tc && tc.status !== 'Approved';
  });
  
  const handleDownloadCSV = () => {
    if (selectedTestCases.length === 0) {
      toast({
        title: "No test cases selected",
        description: "Please select at least one test case to download.",
        variant: "destructive"
      });
      return;
    }
    
    if (anyNotApproved) {
      setIsDownloadDialogOpen(true);
      return;
    }
    
    downloadSelectedTestCases();
  };
  
  const downloadSelectedTestCases = () => {
    // Get selected test cases
    const selectedTC = testCases.filter(tc => selectedTestCases.includes(tc.id));
    
    // Create CSV content
    const headers = ['ID', 'Summary', 'Type', 'Status', 'LinkedUserStories', 'Steps', 'Created', 'Updated'];
    const csvRows = [headers.join(',')];
    
    selectedTC.forEach(tc => {
      const steps = tc.steps.map(s => `Step ${s.stepNumber}: ${s.action} -> ${s.expectedResult}`).join('; ');
      const row = [
        tc.id,
        `"${tc.summary.replace(/"/g, '""')}"`,
        tc.type,
        tc.status,
        `"${tc.linkedUserStories.join(', ')}"`,
        `"${steps.replace(/"/g, '""')}"`,
        tc.createdAt.toISOString(),
        tc.updatedAt.toISOString()
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `test-cases-${projectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsDownloadDialogOpen(false);
    clearSelectedTestCases();
    
    toast({
      title: "Download started",
      description: `Downloading ${selectedTC.length} test cases as CSV.`
    });
  };
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">Test Cases</h2>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <Button
              variant="outline"
              disabled={selectedTestCases.length === 0}
              onClick={handleDownloadCSV}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({filteredTestCases.length})
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
            {filteredTestCases.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  {searchTerm 
                    ? 'No test cases match your search criteria.' 
                    : 'No test cases found. Upload a document to generate test cases.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTestCases.map((testCase) => (
                  <TestCaseDetail key={testCase.id} testCase={testCase} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="functional" className="mt-4">
            {renderTestCaseList(testCasesByType.Functional)}
          </TabsContent>
          
          <TabsContent value="performance" className="mt-4">
            {renderTestCaseList(testCasesByType.Performance)}
          </TabsContent>
          
          <TabsContent value="security" className="mt-4">
            {renderTestCaseList(testCasesByType.Security)}
          </TabsContent>
          
          <TabsContent value="accessibility" className="mt-4">
            {renderTestCaseList(testCasesByType.Accessibility)}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Download Warning Dialog */}
      <AlertDialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Download Restrictions</AlertDialogTitle>
            <AlertDialogDescription>
              Some of your selected test cases are not in the "Approved" status.
              Only test cases with "Approved" status can be downloaded.
              Please update the status of all selected test cases or select only "Approved" test cases.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsDownloadDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
  
  function renderTestCaseList(testCases: TestCase[]) {
    return testCases.length === 0 ? (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {searchTerm 
            ? 'No test cases match your search criteria.' 
            : 'No test cases of this type found.'}
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {testCases.map((testCase) => (
          <TestCaseDetail key={testCase.id} testCase={testCase} />
        ))}
      </div>
    );
  }
};

export default TestCaseManager;
