
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Download, Filter, Plus, RefreshCw, Upload } from 'lucide-react';
import Layout from '@/components/Layout';
import TestCaseDetail from '@/components/TestCaseDetail';
import { TestCase, TestCaseStatus, TestCaseType } from '@/types';

const Dashboard: React.FC = () => {
  const { testCases, selectedTestCases, setSelectedTestCases, updateTestCase } = useTestCases();
  const { toast } = useToast();
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserStory, setFilterUserStory] = useState('all');

  // Get all unique YouTrack IDs from all test cases
  const allUserStories = Array.from(
    new Set(
      testCases.flatMap((tc) => tc.linkedUserStories)
    )
  ).sort();

  // Filter test cases based on selected filters
  const filteredTestCases = testCases.filter((tc) => {
    // Filter by type
    if (filterType !== 'All' && tc.type !== filterType) {
      return false;
    }
    
    // Filter by status
    if (filterStatus !== 'All' && tc.status !== filterStatus) {
      return false;
    }
    
    // Filter by user story
    if (filterUserStory !== 'all' && !tc.linkedUserStories.includes(filterUserStory)) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !tc.summary.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Group test cases by type
  const testCasesByType: Record<string, TestCase[]> = {
    Functional: filteredTestCases.filter((tc) => tc.type === 'Functional'),
    Performance: filteredTestCases.filter((tc) => tc.type === 'Performance'),
    Security: filteredTestCases.filter((tc) => tc.type === 'Security'),
    Accessibility: filteredTestCases.filter((tc) => tc.type === 'Accessibility'),
  };

  // Handle bulk status update
  const bulkUpdateStatus = (status: TestCaseStatus) => {
    if (selectedTestCases.length === 0) {
      toast({
        title: "No test cases selected",
        description: "Please select at least one test case to update.",
        variant: "destructive",
      });
      return;
    }

    selectedTestCases.forEach((id) => {
      updateTestCase(id, { status, updatedAt: new Date() });
    });

    toast({
      title: "Test cases updated",
      description: `${selectedTestCases.length} test cases updated to ${status}.`,
    });
  };

  // Handle CSV export
  const exportToCSV = () => {
    if (selectedTestCases.length === 0) {
      toast({
        title: "No test cases selected",
        description: "Please select at least one test case to export.",
        variant: "destructive",
      });
      return;
    }

    const testCasesToExport = testCases.filter((tc) => selectedTestCases.includes(tc.id));
    
    // Create CSV content
    let csvContent = "Summary,YouTrack IDs,Type,Status,Step Number,Action,Expected Result\n";
    
    testCasesToExport.forEach((tc) => {
      const youtrackIds = tc.linkedUserStories.join(', ');
      
      tc.steps.forEach((step) => {
        // Create a row for the first step with test case details
        if (step.stepNumber === 1) {
          csvContent += `"${tc.summary}","${youtrackIds}","${tc.type}","${tc.status}",${step.stepNumber},"${step.action}","${step.expectedResult}"\n`;
        } else {
          // Create rows for subsequent steps without repeating test case details
          csvContent += `,,,,${step.stepNumber},"${step.action}","${step.expectedResult}"\n`;
        }
      });
    });
    
    // Create a downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'test_cases.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "CSV exported",
      description: `Successfully exported ${testCasesToExport.length} test cases to CSV.`,
    });
  };

  // Select all visible test cases
  const selectAllVisible = () => {
    const visibleIds = filteredTestCases.map((tc) => tc.id);
    setSelectedTestCases(visibleIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedTestCases([]);
  };

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Test Case Dashboard</h1>
            
            <div className="flex flex-wrap gap-2">
              <Link to="/upload">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  New Upload
                </Button>
              </Link>
              
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload to YouTrack
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-6">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="w-full xs:w-auto">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-1" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Types</SelectItem>
                      <SelectItem value="Functional">Functional</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                      <SelectItem value="Security">Security</SelectItem>
                      <SelectItem value="Accessibility">Accessibility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full xs:w-auto">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-1" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Statuses</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Reviewed">Reviewed</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full xs:w-auto">
                  <Select value={filterUserStory} onValueChange={setFilterUserStory}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <Filter className="h-4 w-4 mr-1" />
                      <SelectValue placeholder="User Story" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All User Stories</SelectItem>
                      {allUserStories.map((id) => (
                        <SelectItem key={id} value={id}>
                          {id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="ghost" size="icon" onClick={() => {
                  setFilterType('All');
                  setFilterStatus('All');
                  setFilterUserStory('all');
                  setSearchTerm('');
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    filteredTestCases.length > 0 &&
                    filteredTestCases.every((tc) => selectedTestCases.includes(tc.id))
                  }
                  onCheckedChange={() => {
                    if (
                      filteredTestCases.length > 0 &&
                      filteredTestCases.every((tc) => selectedTestCases.includes(tc.id))
                    ) {
                      clearSelection();
                    } else {
                      selectAllVisible();
                    }
                  }}
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {filteredTestCases.length > 0 &&
                  filteredTestCases.every((tc) => selectedTestCases.includes(tc.id))
                    ? "Unselect All"
                    : "Select All"}
                </label>
              </div>
              
              {selectedTestCases.length > 0 && (
                <>
                  <span className="text-sm text-gray-500">
                    {selectedTestCases.length} selected
                  </span>
                  
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => bulkUpdateStatus('Reviewed')}
                    >
                      Mark as Reviewed
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => bulkUpdateStatus('Approved')}
                    >
                      Mark as Approved
                    </Button>
                  </div>
                </>
              )}
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
                  <p className="text-gray-500 dark:text-gray-400">
                    No test cases found. Try adjusting your filters or uploading a new document.
                  </p>
                  <Link to="/upload">
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-1" />
                      Upload Documents
                    </Button>
                  </Link>
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
              {testCasesByType.Functional.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 dark:text-gray-400">
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
                  <p className="text-gray-500 dark:text-gray-400">
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
                  <p className="text-gray-500 dark:text-gray-400">
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
                  <p className="text-gray-500 dark:text-gray-400">
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
    </Layout>
  );
};

export default Dashboard;
