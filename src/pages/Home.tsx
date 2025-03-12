
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, CheckCircle, ClipboardList, Share2, Braces } from 'lucide-react';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <Braces className="h-16 w-16 text-teal-600 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Test Case Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
          A streamlined solution for creating, managing, and tracking test cases based on PRDs and meeting transcripts, 
          with AI assistance to accelerate your QA processes.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mb-8">
          <FeatureCard 
            icon={<FileText className="h-10 w-10 text-teal-600" />}
            title="Document-Driven Testing"
            description="Upload PRDs and meeting transcripts to automatically generate relevant test cases aligned with product requirements."
          />
          
          <FeatureCard 
            icon={<CheckCircle className="h-10 w-10 text-teal-600" />}
            title="Simplified Workflows"
            description="Streamlined statuses from Draft to Approved, making it easy to track test case progress."
          />
          
          <FeatureCard 
            icon={<ClipboardList className="h-10 w-10 text-teal-600" />}
            title="Comprehensive Test Cases"
            description="Create detailed functional, performance, security, and accessibility test cases with step-by-step actions and expected results."
          />
          
          <FeatureCard 
            icon={<Share2 className="h-10 w-10 text-teal-600" />}
            title="YouTrack Integration"
            description="Link test cases to YouTrack stories, maintaining traceability between requirements and test coverage."
          />
        </div>
        
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Badge variant="outline" className="text-sm py-1 px-3">Functional Testing</Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">Performance Testing</Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">Security Testing</Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">Accessibility Testing</Badge>
          <Badge variant="outline" className="text-sm py-1 px-3">Test Case Management</Badge>
        </div>
        
        <Link to="/projects">
          <Button size="lg" className="gap-2">
            Get Started
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Home;
