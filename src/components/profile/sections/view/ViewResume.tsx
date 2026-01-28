import { FileText, Download } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';

export default function ViewResume({
  resume,
}: {
  resume: string | null | undefined;
}) {
  const resumeFileName = resume
    ? typeof resume === 'string'
      ? resume.split('/').pop()
      : 'N/A'
    : 'N/A';

  return (
    <SectionCard>
      <SectionHeader
        icon={<FileText size={24} className="text-blue-600" />}
        title="Resume"
      />
      {resume ? (
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-gray-500" />
          <span className="text-gray-700 font-medium truncate max-w-xs">
            {resumeFileName}
          </span>
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <Download size={16} />
            Download
          </a>
        </div>
      ) : (
        <p className="text-gray-500">No resume uploaded yet.</p>
      )}
    </SectionCard>
  );
}
