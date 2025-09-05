"use client";

import React, { useState } from 'react';
import { Award, Users, Plus, Trash2 } from 'lucide-react';

interface SkillsTabProps {
  skills: string[];
  isEditing: boolean;
  onSkillsChange: (skills: string[]) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, isEditing, onSkillsChange }) => {
  const [newSkill, setNewSkill] = useState<string>('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Award className="mr-2 text-blue-500" size={20} />
        Skills & Expertise
      </h2>

      {isEditing ? (
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a new skill"
              className="flex-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full pl-3 pr-2 py-1">
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-700 font-medium">{skill}</span>
                <span className="text-gray-500">Proficient</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `85%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Users className="mr-2 text-blue-500" size={20} />
          Additional Expertise
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Agile Methodology', 'Team Leadership', 'Project Management', 'Code Review', 'Mentoring', 'Technical Writing'].map((item, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;