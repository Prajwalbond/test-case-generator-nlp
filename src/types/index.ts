
export type TestCaseType = 'Functional' | 'Performance' | 'Security' | 'Accessibility';

export type TestCaseStatus = 'Draft' | 'Reviewed' | 'Approved';

export interface TestStep {
  stepNumber: number;
  action: string;
  expectedResult: string;
}

export interface TestCase {
  id: string;
  projectId?: string; // New field to link test cases to projects
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
  projectId?: string; // New field to link uploads to projects
}

// New Project types
export interface Document {
  id: string;
  name: string;
  type: 'PRD' | 'Transcript';
  uploadDate: Date;
  filePath?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Mock data for initial test cases
export const mockTestCases: TestCase[] = [
  {
    id: 'tc-001',
    projectId: 'proj-001', // Link to first project
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
    projectId: 'proj-001', // Link to first project
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
    projectId: 'proj-002', // Link to second project
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
    projectId: 'proj-002', // Link to second project
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
    projectId: 'proj-003', // Link to third project
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

// Mock data for projects
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'NeucoinsPay Integration',
    description: 'Loyalty program integration with payment gateway',
    documents: [
      {
        id: 'doc-001',
        name: 'NeucoinsPay PRD v1.2.pdf',
        type: 'PRD',
        uploadDate: new Date(2023, 9, 15)
      },
      {
        id: 'doc-002',
        name: 'Integration Planning Call - Oct 12.txt',
        type: 'Transcript',
        uploadDate: new Date(2023, 9, 12)
      }
    ],
    createdAt: new Date(2023, 9, 10),
    updatedAt: new Date(2023, 9, 15)
  },
  {
    id: 'proj-002',
    name: 'Admin Dashboard Redesign',
    description: 'Performance and security improvements for admin dashboard',
    documents: [
      {
        id: 'doc-003',
        name: 'Admin Dashboard PRD.pdf',
        type: 'PRD',
        uploadDate: new Date(2023, 8, 5)
      }
    ],
    createdAt: new Date(2023, 8, 1),
    updatedAt: new Date(2023, 8, 5)
  },
  {
    id: 'proj-003',
    name: 'Accessibility Compliance',
    description: 'Ensuring WCAG 2.1 AA compliance across all user interfaces',
    documents: [
      {
        id: 'doc-004',
        name: 'Accessibility Requirements.pdf',
        type: 'PRD',
        uploadDate: new Date(2023, 7, 20)
      },
      {
        id: 'doc-005',
        name: 'Accessibility Planning Meeting.txt',
        type: 'Transcript',
        uploadDate: new Date(2023, 7, 15)
      }
    ],
    createdAt: new Date(2023, 7, 10),
    updatedAt: new Date(2023, 7, 20)
  }
];
