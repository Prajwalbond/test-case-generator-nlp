
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TestCase, TestCaseStatus } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronDown, ChevronUp, Pencil, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestCaseDetailProps {
  testCase: TestCase;
}

const TestCaseDetail: React.FC<TestCaseDetailProps> = ({ testCase }) => {
  const { updateTestCase, toggleTestCaseSelection, selectedTestCases } = useTestCases();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [status, setStatus] = useState<TestCaseStatus>(testCase.status);
  
  const isSelected = selectedTestCases.includes(testCase.id);
  
  const handleStatusChange = (value: string) => {
    setStatus(value as TestCaseStatus);
  };
  
  const saveChanges = () => {
    updateTestCase(testCase.id, { status, updatedAt: new Date() });
    setIsEditing(false);
    toast({
      title: "Test case updated",
      description: "The test case status has been updated.",
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
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
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
            {isEditing ? (
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[120px] h-7">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Reviewed">Reviewed</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={getStatusColor(testCase.status)}>
                {testCase.status}
              </Badge>
            )}
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
          {isEditing ? (
            <>
              <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={saveChanges}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TestCaseDetail;
