import { Briefcase } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Experience } from '@/lib/types/entities';

export default function ViewExperience({
  experience,
}: {
  experience: Experience[];
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
        icon={<Briefcase size={24} className="text-blue-600" />}
        title="Experience"
      />
      {experience?.length > 0 ? (
        <div className="space-y-5">
          {experience.map((exp, index) => (
            <div
              key={index}
              className="py-4 border-b border-gray-100 last:border-b-0"
            >
              <h4 className="font-semibold text-gray-900 text-lg">
                {exp.position}
              </h4>
              <p className="text-gray-700">{exp.company}</p>
              {exp.startDate && (
                <p className="text-gray-500 text-sm mt-1">
                  {formatDate(exp.startDate)} -{' '}
                  {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                </p>
              )}
              {exp.description && (
                <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No experience information added yet.</p>
      )}
    </SectionCard>
  );
}
