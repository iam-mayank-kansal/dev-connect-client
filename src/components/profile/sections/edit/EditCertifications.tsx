import { Award, Plus, Trash2 } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Certification } from '@/lib/types/entities';

interface EditCertificationsProps {
  data: Certification[];
  onUpdate: (updated: Certification[]) => void;
}

export default function EditCertifications({
  data,
  onUpdate,
}: EditCertificationsProps) {
  const inputStyle =
    'block border w-full p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const addItem = () => {
    onUpdate([
      ...(data || []),
      { certificate: '', company: '', issuedBy: '', issueDate: '' },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...(data || [])];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <SectionCard>
      <div className="flex justify-between items-center mb-4">
        <SectionHeader icon={<Award size={24} />} title="Certifications" />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
        >
          <Plus size={16} /> Add Certificate
        </button>
      </div>
      <div className="space-y-4">
        {data?.map((cert: Certification, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-gray-50 relative"
          >
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Certificate Name
                </label>
                <input
                  value={cert.certificate}
                  onChange={(e) =>
                    handleChange(index, 'certificate', e.target.value)
                  }
                  className={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Company/Org
                </label>
                <input
                  value={cert.company}
                  onChange={(e) =>
                    handleChange(index, 'company', e.target.value)
                  }
                  className={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Issued By
                </label>
                <input
                  value={cert.issuedBy || ''}
                  onChange={(e) =>
                    handleChange(index, 'issuedBy', e.target.value)
                  }
                  className={inputStyle}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={
                    cert.issueDate
                      ? new Date(cert.issueDate).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) =>
                    handleChange(index, 'issueDate', e.target.value)
                  }
                  className={inputStyle}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
