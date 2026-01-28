import { Code } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';

export default function ViewSkills({ skills }: { skills: string[] }) {
  return (
    <SectionCard>
      <SectionHeader
        icon={<Code size={24} className="text-blue-600" />}
        title="Skills"
      />
      {skills?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No skills added yet.</p>
      )}
    </SectionCard>
  );
}
