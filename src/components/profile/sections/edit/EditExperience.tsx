import { Briefcase, Plus, Trash2 } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Experience } from '@/lib/types/entities';

interface EditExperienceProps {
  data: Experience[];
  onUpdate: (updated: Experience[]) => void;
}

export default function EditExperience({
  data,
  onUpdate,
}: EditExperienceProps) {
  const inputStyle =
    'block border w-full p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...(data || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const handleCurrentToggle = (index: number, isChecked: boolean) => {
    const updated = [...(data || [])];
    if (isChecked) {
      // If checked, clear end date to signify "Current"
      updated[index] = { ...updated[index], endDate: '' };
    } else {
      // If unchecked, set to Today's date to enable input and uncheck box
      updated[index] = {
        ...updated[index],
        endDate: new Date().toISOString().split('T')[0],
      };
    }
    onUpdate(updated);
  };

  const addItem = () => {
    onUpdate([
      ...(data || []),
      {
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
      },
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
        <SectionHeader icon={<Briefcase size={24} />} title="Experience" />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
        >
          <Plus size={16} /> Add Position
        </button>
      </div>
      <div className="space-y-6">
        {data?.map((exp: Experience, index: number) => {
          // If endDate is empty, we consider it "Current"
          const isCurrent = !exp.endDate || exp.endDate === '';

          return (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 relative group"
            >
              {/* Header Row: Position/Company & Delete Button */}
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Position
                    </label>
                    <input
                      value={exp.position}
                      onChange={(e) =>
                        handleChange(index, 'position', e.target.value)
                      }
                      className={inputStyle}
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Company
                    </label>
                    <input
                      value={exp.company}
                      onChange={(e) =>
                        handleChange(index, 'company', e.target.value)
                      }
                      className={inputStyle}
                      placeholder="e.g. Google"
                    />
                  </div>
                </div>

                {/* Better Aligned Delete Button */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-5 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Remove Position"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      exp.startDate
                        ? new Date(exp.startDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      handleChange(index, 'startDate', e.target.value)
                    }
                    className={inputStyle}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-500">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={
                      exp.endDate
                        ? new Date(exp.endDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    className={`${inputStyle} ${isCurrent ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-white'}`}
                    disabled={isCurrent}
                  />

                  <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={(e) =>
                        handleCurrentToggle(index, e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      Currently working here
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">
                  Description
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) =>
                    handleChange(index, 'description', e.target.value)
                  }
                  rows={2}
                  className={inputStyle}
                  placeholder="Describe your role and achievements..."
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
