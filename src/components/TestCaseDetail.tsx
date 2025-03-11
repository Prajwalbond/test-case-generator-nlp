
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TestCase } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ChevronDown, ChevronUp, Edit, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TestCaseEditor from './TestCaseEditor';

interface TestCaseDetailProps {
  testCase: TestCase;
}

const TestCaseDetail: React.FC<TestCaseDetailProps> = ({ testCase }) => {
  const { updateTestCase, deleteTestCase, toggleTestCaseSelection, selectedTestCases } = useTestCases();
  const { toast } = useToast();
  const [showSteps, setShowSteps] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const isSelected = selectedTestCases.includes(testCase.id);
  
  const handleStatusChange = (value: string) => {
    updateTestCase(testCase.id, { 
      status: value as any, 
      updatedAt: new Date() 
    });
    
    toast({
      title: "Status updated",
      description: `Test case status updated to ${value}.`
    });
  };
  
  const handleDeleteTestCase = () => {
    deleteTestCase(testCase.id);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Test case deleted",
      description: "The test case has been deleted successfully."
    });
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Functional':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Performance':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Security':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Accessibility':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Move to Product Review':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Product Comments':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Accepted by Product':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <>
      <Card className={`mb-4 ${isSelected ? 'border-teal-500 ring-1 ring-teal-500' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => toggleTestCaseSelection(testCase.id)}
                id={`select-${testCase.id}`}
                className="mt-1"
              />
              <div>
                <CardTitle className="text-lg">{testCase.summary}</CardTitle>
                <CardDescription className="mt-1">
                  {testCase.linkedUserStories.map((id) => (
                    <Badge key={id} variant="outline" className="mr-1">
                      {id}
                    </Badge>
                  ))}
                </CardDescription>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Badge className={getTypeColor(testCase.type)}>
                {testCase.type}
              </Badge>
              <Select defaultValue={testCase.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] h-7">
                  <SelectValue>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(testCase.status)}`}>
                      {testCase.status}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Move to Product Review">Move to Product Review</SelectItem>
                  <SelectItem value="Product Comments">Product Comments</SelectItem>
                  <SelectItem value="Accepted by Product">Accepted by Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 h-8 mb-2"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Hide Steps
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Steps ({testCase.steps.length})
              </>
            )}
          </Button>
          
          {showSteps && (
            <div className="mt-2 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 w-16 text-gray-500 text-sm font-medium">Step</th>
                    <th className="pb-2 w-1/2 text-gray-500 text-sm font-medium">Action</th>
                    <th className="pb-2 text-gray-500 text-sm font-medium">Expected Result</th>
                  </tr>
                </thead>
                <tbody>
                  {testCase.steps.map((step) => (
                    <tr key={step.stepNumber} className="border-b last:border-0">
                      <td className="py-2 text-gray-500">{step.stepNumber}</td>
                      <td className="py-2">{step.action}</td>
                      <td className="py-2">{step.expectedResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-1">
          <div className="text-sm text-gray-500">
            Last updated: {testCase.updatedAt.toLocaleString()}
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test Case</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test case? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTestCase} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Test Case Dialog */}
      <TestCaseEditor 
        testCase={testCase} 
        isOpen={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
      />
    </>
  );
};

export default TestCaseDetail;
