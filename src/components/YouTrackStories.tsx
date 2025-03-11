
import React, { useState } from 'react';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Tag, X } from 'lucide-react';

interface YouTrackStoriesProps {
  projectId: string;
}

const YouTrackStories: React.FC<YouTrackStoriesProps> = ({ projectId }) => {
  const { getProjectById, updateProject } = useTestCases();
  const { toast } = useToast();
  const project = getProjectById(projectId);
  
  const [youtrackInput, setYoutrackInput] = useState('');
  
  if (!project) return null;
  
  const stories = project.youtrackStories || [];
  
  const handleAddStories = () => {
    if (!youtrackInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one YouTrack ID",
        variant: "destructive",
      });
      return;
    }
    
    const newStories = youtrackInput
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
    
    const existingStories = new Set(stories);
    const uniqueNewStories = newStories.filter(id => !existingStories.has(id));
    
    if (uniqueNewStories.length === 0) {
      toast({
        title: "No new stories",
        description: "All the entered YouTrack IDs already exist in the project."
      });
      return;
    }
    
    const updatedStories = [...stories, ...uniqueNewStories];
    
    updateProject(projectId, {
      youtrackStories: updatedStories,
      updatedAt: new Date()
    });
    
    setYoutrackInput('');
    
    toast({
      title: "YouTrack stories added",
      description: `Added ${uniqueNewStories.length} new YouTrack stories to the project.`
    });
  };
  
  const handleRemoveStory = (storyId: string) => {
    const updatedStories = stories.filter(id => id !== storyId);
    
    updateProject(projectId, {
      youtrackStories: updatedStories,
      updatedAt: new Date()
    });
    
    toast({
      title: "YouTrack story removed",
      description: `Removed ${storyId} from the project.`
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">YouTrack Stories</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Add YouTrack IDs (comma-separated, e.g., YT-123, YT-456)"
            value={youtrackInput}
            onChange={(e) => setYoutrackInput(e.target.value)}
          />
        </div>
        <Button onClick={handleAddStories}>
          <Tag className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {stories.length === 0 ? (
          <p className="text-sm text-gray-500">No YouTrack stories linked to this project yet.</p>
        ) : (
          stories.map(story => (
            <Badge key={story} variant="outline" className="flex items-center gap-1 py-1">
              {story}
              <button
                onClick={() => handleRemoveStory(story)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  );
};

export default YouTrackStories;
