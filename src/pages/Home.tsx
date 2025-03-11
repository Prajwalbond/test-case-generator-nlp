
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, FileText, List, Upload } from 'lucide-react';
import Layout from '@/components/Layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
              <span className="block text-teal-600">Test Case Generation</span>
              <span className="block">Powered by NLP</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Automatically generate structured test cases from PRDs, YouTrack user stories, and meeting transcripts.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/upload">
                <Button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                  Get Started
                  <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              Our NLP engine extracts test cases from your documents in three simple steps.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload your PRDs, YouTrack user stories, or meeting transcripts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Our system supports various document formats including PDF, Word, and plain text files.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/upload">
                    <Button variant="outline" className="w-full mt-4">
                      Upload Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>NLP Processing</CardTitle>
                  <CardDescription>
                    Our AI analyzes your documents to extract test scenarios and requirements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    The NLP engine identifies test cases, edge cases, and categorizes them automatically.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <List className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle>Review & Export</CardTitle>
                  <CardDescription>
                    Review generated test cases, refine them, and export to your preferred format.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Test cases follow Gherkin syntax and can be exported to YouTrack or CSV.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full mt-4">
                      View Dashboard
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
