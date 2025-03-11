
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestCases } from '@/context/TestCaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { FileText, FileUp, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import nlpService from '@/services/nlpService';
import { UploadFormData } from '@/types';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const { addTestCases } = useTestCases();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    prdFile: null,
    transcriptFile: null,
    youtrackIds: '',
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: 'prdFile' | 'transcriptFile'
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        [fileType]: e.target.files[0],
      });
    }
  };

  const handleYouTrackIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      youtrackIds: e.target.value,
    });
  };

  const processPRD = async () => {
    if (!formData.prdFile) {
      toast({
        title: "No PRD file",
        description: "Please upload a PRD file to process.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.youtrackIds) {
      toast({
        title: "No YouTrack IDs",
        description: "Please enter at least one YouTrack ID.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Read the file content
      const fileContent = await formData.prdFile.text();
      
      // Process the IDs
      const youtrackIds = formData.youtrackIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
      
      // Generate test cases from PRD
      const generatedTestCases = await nlpService.generateTestCasesFromPRD(
        fileContent,
        youtrackIds
      );
      
      // Add test cases to the context
      addTestCases(generatedTestCases);
      
      toast({
        title: "Test cases generated",
        description: `Successfully generated ${generatedTestCases.length} test cases from the PRD.`,
      });
      
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error processing PRD:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the PRD.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processTranscript = async () => {
    if (!formData.transcriptFile) {
      toast({
        title: "No transcript file",
        description: "Please upload a transcript file to process.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.youtrackIds) {
      toast({
        title: "No YouTrack IDs",
        description: "Please enter at least one YouTrack ID.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Read the file content
      const fileContent = await formData.transcriptFile.text();
      
      // Process the IDs
      const youtrackIds = formData.youtrackIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);
      
      // Generate test cases from transcript
      const generatedTestCases = await nlpService.generateTestCasesFromTranscript(
        fileContent,
        youtrackIds
      );
      
      // Add test cases to the context
      addTestCases(generatedTestCases);
      
      toast({
        title: "Test cases generated",
        description: `Successfully generated ${generatedTestCases.length} test cases from the transcript.`,
      });
      
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error processing transcript:", error);
      toast({
        title: "Error",
        description: "An error occurred while processing the transcript.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upload Documents</h1>
          
          <Tabs defaultValue="prd" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prd">
                <FileText className="h-4 w-4 mr-2" />
                PRD
              </TabsTrigger>
              <TabsTrigger value="transcript">
                <FileUp className="h-4 w-4 mr-2" />
                Transcript
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prd">
              <Card>
                <CardHeader>
                  <CardTitle>Upload PRD Document</CardTitle>
                  <CardDescription>
                    Upload a PRD document in PDF, Word, or text format to generate test cases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="prd-file">PRD File</Label>
                    <Input
                      id="prd-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => handleFileChange(e, 'prdFile')}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.prdFile ? `Selected: ${formData.prdFile.name}` : 'No file selected'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtrack-ids-prd">YouTrack IDs (comma-separated)</Label>
                    <Input
                      id="youtrack-ids-prd"
                      placeholder="YT-123, YT-456, YT-789"
                      value={formData.youtrackIds}
                      onChange={handleYouTrackIdsChange}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the YouTrack IDs to link with the generated test cases.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={processPRD}
                    disabled={isProcessing || !formData.prdFile || !formData.youtrackIds}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Generate Test Cases'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="transcript">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Meeting Transcript</CardTitle>
                  <CardDescription>
                    Upload a transcript from product grooming calls to extract test cases.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="transcript-file">Transcript File</Label>
                    <Input
                      id="transcript-file"
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      onChange={(e) => handleFileChange(e, 'transcriptFile')}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.transcriptFile ? `Selected: ${formData.transcriptFile.name}` : 'No file selected'}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="youtrack-ids-transcript">YouTrack IDs (comma-separated)</Label>
                    <Input
                      id="youtrack-ids-transcript"
                      placeholder="YT-123, YT-456, YT-789"
                      value={formData.youtrackIds}
                      onChange={handleYouTrackIdsChange}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter the YouTrack IDs to link with the generated test cases.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={processTranscript}
                    disabled={isProcessing || !formData.transcriptFile || !formData.youtrackIds}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Generate Test Cases'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
