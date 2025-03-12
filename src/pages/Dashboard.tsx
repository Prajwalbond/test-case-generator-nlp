
import React, { useState, useEffect } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TestCaseDetail from '@/components/TestCaseDetail';
import { TestCase } from '@/types';
import { Download, Search } from 'lucide-react';
import Layout from '@/components/Layout';

const Dashboard: React.FC = () => {
  const { testCases, selectedTestCases } = useTestCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>(testCases);
  
  useEffect(() => {
    // Filter test cases based on search term
    const filtered = testCases.filter(tc => 
      tc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.linkedUserStories.some(id => id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredTestCases(filtered);
  }, [testCases, searchTerm]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const canDownloadSelected = selectedTestCases.length > 0 && 
    selectedTestCases.every(id => {
      const tc = testCases.find(t => t.id === id);
      return tc?.status === 'Accepted by Product';
    });
    
  const handleDownloadCSV = () => {
    // Get selected test cases
    const casesToDownload = testCases.filter(tc => 
      selectedTestCases.includes(tc.id) && tc.status === 'Accepted by Product'
    );
    
    if (casesToDownload.length === 0) return;
    
    // Create CSV content
    let csvContent = "ID,Summary,YouTrack IDs,Type,Status,Steps\n";
    
    casesToDownload.forEach(tc => {
      const stepsText = tc.steps
        .map(step => `Step ${step.stepNumber}: ${step.action} -> ${step.expectedResult}`)
        .join(" | ");
        
      const row = [
        tc.id,
        `"${tc.summary.replace(/"/g, '""')}"`,
        `"${tc.linkedUserStories.join(', ')}"`,
        tc.type,
        tc.status,
        `"${stepsText.replace(/"/g, '""')}"`
      ];
      
      csvContent += row.join(",") + "\n";
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'test_cases.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Test Case Dashboard</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search test cases..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <Button
                variant="outline"
                onClick={handleDownloadCSV}
                disabled={!canDownloadSelected}
                className={!canDownloadSelected ? 'opacity-50 cursor-not-allowed' : ''}
                title={!canDownloadSelected ? "Only 'Accepted by Product' test cases can be downloaded" : "Download selected test cases"}
              >
                <Download className="h-4 w-4 mr-1" />
                Export Selected
              </Button>
            </div>
          </div>
          
          {filteredTestCases.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-gray-50 dark:bg-gray-900">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No test cases found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Try a different search term.' : 'Create your first test case to get started.'}
              </p>
            </div>
          ) : (
            filteredTestCases.map((testCase) => (
              <TestCaseDetail key={testCase.id} testCase={testCase} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
