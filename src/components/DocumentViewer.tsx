
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Document } from '@/types';
import { CalendarDays, FileText, FileUp } from 'lucide-react';

interface DocumentViewerProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, isOpen, onClose }) => {
  if (!document) return null;
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {document.type === 'PRD' ? (
              <FileText className="h-5 w-5 text-blue-500" />
            ) : (
              <FileUp className="h-5 w-5 text-green-500" />
            )}
            <DialogTitle>{document.name}</DialogTitle>
          </div>
          <DialogDescription>
            {document.type} • Uploaded on {formatDate(document.uploadDate)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900 mt-4 max-h-[60vh] overflow-y-auto">
          {document.content ? (
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {document.content}
            </pre>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Document content not available for preview.</p>
              <p className="text-sm mt-2">This is a placeholder for actual document content.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
