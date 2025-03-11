
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

// Mock data for initial test cases
export const mockTestCases: TestCase[] = [
  {
    id: 'tc-001',
    summary: "Verify user will see 'Earn up to N neucoins' on neucoins strip when user has 'No referrals'",
    linkedUserStories: ['YT-123', 'YT-456'],
    type: 'Functional',
    status: 'Draft',
    steps: [
      { stepNumber: 1, action: "Launch and login to App", expectedResult: "User will land on logged-in homepage" },
      { stepNumber: 2, action: "Click on Hamburger menu", expectedResult: "User will land on hamburger menu" },
      { stepNumber: 3, action: "Click on refer a friend", expectedResult: "User will land on refer a friend page" },
      { stepNumber: 4, action: "Check for 'Earn up to N neucoins' text on neupass tab", expectedResult: "User will see 'Earn up to N neucoins' text on neupass tab" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tc-002',
    summary: "Verify file upload functionality accepts PDF documents",
    linkedUserStories: ['YT-123'],
    type: 'Functional',
    status: 'Reviewed',
    steps: [
      { stepNumber: 1, action: "Navigate to file upload section", expectedResult: "User sees file upload interface" },
      { stepNumber: 2, action: "Select a PDF file from local system", expectedResult: "File is selected and ready for upload" },
      { stepNumber: 3, action: "Click upload button", expectedResult: "File uploads successfully with progress indicator" },
      { stepNumber: 4, action: "Check uploaded files list", expectedResult: "PDF file appears in the uploaded files list" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tc-003',
    summary: "Verify system response time when loading user dashboard with 1000+ records",
    linkedUserStories: ['YT-789'],
    type: 'Performance',
    status: 'Draft',
    steps: [
      { stepNumber: 1, action: "Set up test environment with 1000+ user records", expectedResult: "Test environment is ready" },
      { stepNumber: 2, action: "Login as administrator", expectedResult: "Admin dashboard is loaded" },
      { stepNumber: 3, action: "Navigate to user management section", expectedResult: "User management section loads within 3 seconds" },
      { stepNumber: 4, action: "Apply filter to show all users", expectedResult: "Results display within 5 seconds" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tc-004',
    summary: "Verify system prevents unauthorized access to admin functions",
    linkedUserStories: ['YT-456', 'YT-789'],
    type: 'Security',
    status: 'Approved',
    steps: [
      { stepNumber: 1, action: "Login as regular user", expectedResult: "User dashboard is displayed" },
      { stepNumber: 2, action: "Attempt to access admin URL directly", expectedResult: "Access denied message is displayed" },
      { stepNumber: 3, action: "Attempt to modify request headers to bypass security", expectedResult: "Request is rejected and security log is created" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'tc-005',
    summary: "Verify all form elements have proper ARIA labels for screen readers",
    linkedUserStories: ['YT-456'],
    type: 'Accessibility',
    status: 'Draft',
    steps: [
      { stepNumber: 1, action: "Navigate to user registration form", expectedResult: "Registration form is displayed" },
      { stepNumber: 2, action: "Inspect form elements for ARIA attributes", expectedResult: "All form elements have appropriate aria-label or aria-labelledby attributes" },
      { stepNumber: 3, action: "Test form with screen reader", expectedResult: "Screen reader correctly announces all form elements and their purpose" }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
