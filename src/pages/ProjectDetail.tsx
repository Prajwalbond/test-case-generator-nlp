
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import ProjectHeader from '@/components/ProjectHeader';
import DocumentManager from '@/components/DocumentManager';
import YouTrackStories from '@/components/YouTrackStories';
import TestCaseManager from '@/components/TestCaseManager';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useTestCases();
  
  // Get project details
  const project = projectId ? getProjectById(projectId) : undefined;
  
  if (!project) {
    return (
      <Layout>
        <div className="py-10 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="mb-6">The project you are looking for does not exist or has been removed.</p>
            <button 
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Header */}
          <ProjectHeader project={project} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Documents Section */}
            <Card className="p-6 lg:col-span-2">
              <DocumentManager project={project} />
            </Card>
            
            {/* YouTrack Stories Section */}
            <Card className="p-6">
              <YouTrackStories projectId={project.id} />
            </Card>
          </div>
          
          <Separator className="my-6" />
          
          {/* Test Cases Section */}
          <div className="mb-6">
            <TestCaseManager projectId={project.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
