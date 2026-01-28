import { BookOpen } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Education } from '@/lib/types/entities';

export default function ViewEducation({
  education,
}: {
  education: Education[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <SectionCard>
      <SectionHeader
        icon={<BookOpen size={24} className="text-blue-600" />}
        title="Education"
      />
      {education?.length > 0 ? (
        <div className="space-y-5">
          {education.map((edu, index) => (
            <div
              key={index}
              className="py-4 border-b border-gray-100 last:border-b-0"
            >
              <h4 className="font-semibold text-gray-900 text-lg">
                {edu.degree}
              </h4>
              <p className="text-gray-700">{edu.institution}</p>
              {edu.startDate && (
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(edu.startDate)} -{' '}
                  {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No education information added yet.</p>
      )}
    </SectionCard>
  );
}
