import { FileText, Trash2, Upload, X } from 'lucide-react';
import { useRef } from 'react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';

export default function EditResume({
  currentResumeUrl,
  selectedFile, // <--- New Prop
  onFileChange,
  onUpdate,
}: {
  currentResumeUrl: string | null;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onUpdate: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleRemoveSelected = () => {
    if (fileInputRef.current) fileInputRef.current.value = '';
    onFileChange(null);
  };

  const handleRemoveCurrent = () => {
    onUpdate('');
  };

  const currentFileName = currentResumeUrl
    ? typeof currentResumeUrl === 'string'
      ? currentResumeUrl.split('/').pop()
      : 'Attached Resume'
    : null;

  return (
    <SectionCard>
      <SectionHeader icon={<FileText size={24} />} title="Resume" />
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (PDF)
        </label>

        <div className="flex flex-col gap-3">
          {/* 1. Upload Button */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Upload size={16} />
              {currentResumeUrl || selectedFile
                ? 'Change Resume'
                : 'Upload Resume'}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFile}
                accept=".pdf"
                className="hidden"
              />
            </label>
            <span className="text-xs text-gray-500">PDF only, Max 5MB</span>
          </div>

          {/* 2. Feedback Area: Show either New File OR Current File */}

          {/* CASE A: New File Selected (Pending Upload) */}
          {selectedFile && (
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in slide-in-from-top-1">
              <div className="bg-green-100 p-2 rounded-full">
                <FileText size={18} className="text-green-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-green-600">Ready to save</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveSelected}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Cancel selection"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* CASE B: Existing File (Only show if no new file selected) */}
          {!selectedFile && currentResumeUrl && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="bg-blue-50 p-2 rounded-full">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <a
                  href={currentResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 hover:underline truncate block"
                >
                  {currentFileName}
                </a>
                <p className="text-xs text-gray-500">Current Resume</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveCurrent}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Delete current resume"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
