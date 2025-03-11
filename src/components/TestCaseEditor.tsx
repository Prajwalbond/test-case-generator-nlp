
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestCase, TestCaseStatus, TestCaseType, TestStep } from '@/types';
import { Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestCaseEditorProps {
  testCase: TestCase;
  isOpen: boolean;
  onClose: () => void;
}

const TestCaseEditor: React.FC<TestCaseEditorProps> = ({ testCase, isOpen, onClose }) => {
  const { updateTestCase } = useTestCases();
  const { toast } = useToast();
  
  const [editedTestCase, setEditedTestCase] = useState<TestCase>({ ...testCase });
  const [youtrackInput, setYoutrackInput] = useState(testCase.linkedUserStories.join(', '));
  
  const handleStepChange = (index: number, field: keyof TestStep, value: string) => {
    const updatedSteps = [...editedTestCase.steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: field === 'stepNumber' ? parseInt(value) : value
    };
    
    setEditedTestCase({
      ...editedTestCase,
      steps: updatedSteps
    });
  };
  
  const handleAddStep = () => {
    const nextStepNumber = editedTestCase.steps.length > 0 
      ? Math.max(...editedTestCase.steps.map(s => s.stepNumber)) + 1 
      : 1;
      
    setEditedTestCase({
      ...editedTestCase,
      steps: [
        ...editedTestCase.steps,
        {
          stepNumber: nextStepNumber,
          action: '',
          expectedResult: ''
        }
      ]
    });
  };
  
  const handleRemoveStep = (index: number) => {
    const updatedSteps = [...editedTestCase.steps];
    updatedSteps.splice(index, 1);
    
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, idx) => ({
      ...step,
      stepNumber: idx + 1
    }));
    
    setEditedTestCase({
      ...editedTestCase,
      steps: renumberedSteps
    });
  };
  
  const handleSave = () => {
    // Process YouTrack IDs
    const linkedUserStories = youtrackInput
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    const finalTestCase = {
      ...editedTestCase,
      linkedUserStories,
      updatedAt: new Date()
    };
    
    updateTestCase(testCase.id, finalTestCase);
    
    toast({
      title: "Test case updated",
      description: "The test case has been updated successfully."
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Test Case</DialogTitle>
          <DialogDescription>
            Update the details of this test case including steps and expected results.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-name">Test Case Name</Label>
              <Input
                id="test-name"
                value={editedTestCase.summary}
                onChange={(e) => setEditedTestCase({...editedTestCase, summary: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtrack-ids">YouTrack IDs (comma-separated)</Label>
              <Input
                id="youtrack-ids"
                value={youtrackInput}
                onChange={(e) => setYoutrackInput(e.target.value)}
                placeholder="YT-123, YT-456"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-type">Test Type</Label>
              <Select 
                value={editedTestCase.type} 
                onValueChange={(value: TestCaseType) => setEditedTestCase({...editedTestCase, type: value})}
              >
                <SelectTrigger id="test-type">
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Functional">Functional</SelectItem>
                  <SelectItem value="Performance">Performance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Accessibility">Accessibility</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-status">Status</Label>
              <Select 
                value={editedTestCase.status} 
                onValueChange={(value: TestCaseStatus) => setEditedTestCase({...editedTestCase, status: value})}
              >
                <SelectTrigger id="test-status">
                  <SelectValue placeholder="Select status" />
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
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Test Steps</Label>
              <Button size="sm" variant="outline" onClick={handleAddStep}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
            
            <div className="border rounded-md p-4 space-y-4 max-h-[40vh] overflow-y-auto">
              {editedTestCase.steps.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No steps added yet. Click "Add Step" to begin.
                </div>
              ) : (
                editedTestCase.steps.map((step, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="col-span-1">
                      <Label htmlFor={`step-${index}`} className="sr-only">Step</Label>
                      <Input
                        id={`step-${index}`}
                        value={step.stepNumber}
                        onChange={(e) => handleStepChange(index, 'stepNumber', e.target.value)}
                        className="w-full text-center"
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="col-span-5">
                      <Label htmlFor={`action-${index}`} className="sr-only">Action</Label>
                      <Textarea
                        id={`action-${index}`}
                        value={step.action}
                        onChange={(e) => handleStepChange(index, 'action', e.target.value)}
                        placeholder="Action"
                        rows={2}
                      />
                    </div>
                    
                    <div className="col-span-5">
                      <Label htmlFor={`result-${index}`} className="sr-only">Expected Result</Label>
                      <Textarea
                        id={`result-${index}`}
                        value={step.expectedResult}
                        onChange={(e) => handleStepChange(index, 'expectedResult', e.target.value)}
                        placeholder="Expected Result"
                        rows={2}
                      />
                    </div>
                    
                    <div className="col-span-1 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveStep(index)}
                        className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestCaseEditor;
