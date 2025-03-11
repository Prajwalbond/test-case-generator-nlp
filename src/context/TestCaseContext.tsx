
import React, { createContext, useContext, useState } from 'react';
import { TestCase } from '../types';

interface TestCaseContextType {
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  addTestCases: (newTestCases: TestCase[]) => void;
  updateTestCase: (id: string, updatedTestCase: Partial<TestCase>) => void;
  deleteTestCase: (id: string) => void;
  selectedTestCases: string[];
  setSelectedTestCases: React.Dispatch<React.SetStateAction<string[]>>;
  toggleTestCaseSelection: (id: string) => void;
  clearSelectedTestCases: () => void;
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
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);

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
      }}
    >
      {children}
    </TestCaseContext.Provider>
  );
};
