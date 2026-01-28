import { BookOpen, Plus, Trash2 } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { Education } from '@/lib/types/entities';

interface EditEducationProps {
  data: Education[];
  onUpdate: (updated: Education[]) => void;
}

export default function EditEducation({ data, onUpdate }: EditEducationProps) {
  const inputStyle =
    'block border w-full p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const handleCurrentToggle = (index: number, isChecked: boolean) => {
    const updated = [...data];
    if (isChecked) {
      updated[index] = { ...updated[index], endDate: '' };
    } else {
      updated[index] = {
        ...updated[index],
        endDate: new Date().toISOString().split('T')[0],
      };
    }
    onUpdate(updated);
  };

  const addItem = () => {
    onUpdate([
      ...data,
      { degree: '', institution: '', startDate: '', endDate: '' },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  return (
    <SectionCard>
      <div className="flex justify-between items-center mb-4">
        <SectionHeader icon={<BookOpen size={24} />} title="Education" />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100"
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
      <div className="space-y-4">
        {data.map((edu: Education, index: number) => {
          const isCurrent = !edu.endDate || edu.endDate === '';

          return (
            <div
              key={index}
              className="p-4 border rounded-lg bg-gray-50 relative"
            >
              {/* Header Row: Degree/Institution & Delete Button */}
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Degree
                    </label>
                    <input
                      value={edu.degree}
                      onChange={(e) =>
                        handleChange(index, 'degree', e.target.value)
                      }
                      className={inputStyle}
                      placeholder="e.g. B.Tech"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Institution
                    </label>
                    <input
                      value={edu.institution}
                      onChange={(e) =>
                        handleChange(index, 'institution', e.target.value)
                      }
                      className={inputStyle}
                      placeholder="e.g. IIT Delhi"
                    />
                  </div>
                </div>

                {/* Better Aligned Delete Button */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-5 text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  title="Remove Education"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      edu.startDate
                        ? new Date(edu.startDate).toISOString().split('T')[0]
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
                      edu.endDate
                        ? new Date(edu.endDate).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      handleChange(index, 'endDate', e.target.value)
                    }
                    className={`${inputStyle} ${isCurrent ? 'bg-gray-200 cursor-not-allowed text-gray-400' : 'bg-white'}`}
                    disabled={isCurrent}
                  />

                  {/* Currently Studying Checkbox */}
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
                      Currently studying here
                    </span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
