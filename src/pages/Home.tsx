
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Braces } from 'lucide-react';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
        <Braces className="h-16 w-16 text-teal-600 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Test Case Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mb-8">
          Generate and manage test cases from PRDs and meeting transcripts with AI assistance.
        </p>
        <Link to="/projects">
          <Button size="lg" className="gap-2">
            Get Started
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
