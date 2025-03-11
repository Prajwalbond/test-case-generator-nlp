
import React, { createContext, useContext, useState } from 'react';
import { TestCase, Project, mockTestCases, mockProjects } from '../types';

interface TestCaseContextType {
  // Test case management
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  addTestCases: (newTestCases: TestCase[]) => void;
  updateTestCase: (id: string, updatedTestCase: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  selectedTestCases: string[];
  setSelectedTestCases: React.Dispatch<React.SetStateAction<string[]>>;
  toggleTestCaseSelection: (id: string) => void;
  clearSelectedTestCases: () => void;
  
  // Project management
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  getTestCasesByProjectId: (projectId: string) => TestCase[];
}

const TestCaseContext = createContext<TestCaseContextType | undefined>(undefined);

export const useTestCases = () => {
  const context = useContext(TestCaseContext);
  if (!context) {
    throw new Error('useTestCases must be used within a TestCaseProvider');
  }
  return context;
};

export const TestCaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with mock data
  const [testCases, setTestCases] = useState<TestCase[]>(mockTestCases);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  // Test case management functions
  const addTestCases = (newTestCases: TestCase[]) => {
    setTestCases((prev) => [...prev, ...newTestCases]);
  };

  const updateTestCase = (id: string, updatedTestCase: Partial<TestCase>) => {
    setTestCases((prev) =>
      prev.map((tc) => (tc.id === id ? { ...tc, ...updatedTestCase } : tc))
    );
  };

  const deleteTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  };

  const toggleTestCaseSelection = (id: string) => {
    setSelectedTestCases((prev) =>
      prev.includes(id)
        ? prev.filter((tcId) => tcId !== id)
        : [...prev, id]
    );
  };

  const clearSelectedTestCases = () => {
    setSelectedTestCases([]);
  };

  // Project management functions
  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    
    // Also remove all test cases associated with this project
    setTestCases((prev) => prev.filter((tc) => tc.projectId !== id));
  };

  const getProjectById = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  const getTestCasesByProjectId = (projectId: string) => {
    return testCases.filter((tc) => tc.projectId === projectId);
  };

  return (
    <TestCaseContext.Provider
      value={{
        testCases,
        setTestCases,
        addTestCases,
        updateTestCase,
        deleteTestCase,
        selectedTestCases,
        setSelectedTestCases,
        toggleTestCaseSelection,
        clearSelectedTestCases,
        projects,
        setProjects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        getTestCasesByProjectId
      }}
    >
      {children}
    </TestCaseContext.Provider>
  );
};
