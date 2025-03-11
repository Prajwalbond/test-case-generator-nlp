
export type TestCaseType = 'Functional' | 'Performance' | 'Security' | 'Accessibility';

export type TestCaseStatus = 'Draft' | 'Reviewed' | 'Approved';

export interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  summary: string;
  linkedUserStories: string[]; // YouTrack IDs
  type: TestCaseType;
  status: TestCaseStatus;
  steps: TestStep[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadFormData {
  prdFile?: File | null;
  transcriptFile?: File | null;
  youtrackIds: string;
}
