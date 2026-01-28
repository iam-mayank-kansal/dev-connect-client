import { Code, X, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';

export default function EditSkills({
  skills,
  onUpdate,
}: {
  skills: string[];
  onUpdate: (skills: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState('');

  const inputStyle =
    'block border flex-1 p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  // --- Add Skill Logic ---
  const handleAddSkill = () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput) return;

    // Optional: Prevent duplicates
    if (
      skills?.some(
        (skill) => skill.toLowerCase() === trimmedInput.toLowerCase()
      )
    ) {
      toast.error('Skill already added');
      return;
    }

    const updatedSkills = [...(skills || []), trimmedInput];
    onUpdate(updatedSkills);
    setInputValue(''); // Clear input after adding
  };

  // --- Handle "Enter" Key ---
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      handleAddSkill();
    }
  };

  // --- Remove Skill Logic ---
  const handleRemoveSkill = (indexToRemove: number) => {
    const updatedSkills = (skills || []).filter(
      (_, index) => index !== indexToRemove
    );
    onUpdate(updatedSkills);
  };

  return (
    <SectionCard>
      <SectionHeader icon={<Code size={24} />} title="Skills" />

      <div className="mt-4 space-y-4">
        {/* Input Area */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Add New Skill
          </label>
          <div className="flex gap-2">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a skill (e.g. React) and press Enter"
              className={inputStyle}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={!inputValue.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press <strong>Enter</strong> or click the <strong>+</strong> button
            to add.
          </p>
        </div>

        {/* Tags Display Area */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-800 rounded-full text-sm font-medium shadow-sm group hover:border-blue-400 transition-colors"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors focus:outline-none"
                  aria-label={`Remove ${skill}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {(!skills || skills.length === 0) && (
          <div className="text-sm text-gray-500 italic">
            No skills added yet.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
