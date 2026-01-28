import { Award } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Certification } from '@/lib/types/entities';

export default function ViewCertifications({
  certification,
}: {
  certification: Certification[];
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
        icon={<Award size={24} className="text-blue-600" />}
        title="Certifications"
      />
      {certification?.length > 0 ? (
        <div className="space-y-5">
          {certification.map((cert, index) => (
            <div
              key={index}
              className="py-4 border-b border-gray-100 last:border-b-0"
            >
              <h4 className="font-semibold text-gray-900 text-lg">
                {cert.certificate}
              </h4>
              <p className="text-gray-700">{cert.company}</p>
              {cert.issuedBy && (
                <p className="text-gray-500 text-sm mt-1">
                  Issued by: {cert.issuedBy}
                </p>
              )}
              {cert.issueDate && (
                <p className="text-gray-500 text-sm mt-1">
                  Issued on: {formatDate(cert.issueDate)}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No certifications added yet.</p>
      )}
    </SectionCard>
  );
}
