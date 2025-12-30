import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportViewerProps {
  markdown: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ markdown }) => {
  return (
    <div className="report-content bg-white p-8 rounded-xl shadow-sm border border-gray-200 overflow-y-auto h-full text-sm leading-relaxed text-gray-800">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-blue-600" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold text-gray-800 mt-8 mb-4 bg-gray-100 p-2 rounded-md border-l-4 border-blue-500" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base font-semibold text-gray-800 mt-6 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="mb-4 text-gray-600" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
          table: ({node, ...props}) => <div className="overflow-x-auto mb-6"><table className="min-w-full divide-y divide-gray-200 border border-gray-300" {...props} /></div>,
          thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
          th: ({node, ...props}) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-300 font-bold" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 border-b border-gray-200" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-blue-900" {...props} />,
          hr: ({node, ...props}) => <hr className="my-8 border-gray-200" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default ReportViewer;
