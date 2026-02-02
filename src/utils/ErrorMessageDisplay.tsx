import { AlertTriangle } from 'lucide-react';

const ErrorMessageDisplay = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center p-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative shadow-md">
      <AlertTriangle className="inline-block mr-3 text-red-600" size={24} />
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  </div>
);

export default ErrorMessageDisplay;
