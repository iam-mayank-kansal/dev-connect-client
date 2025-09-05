"use client";

import React, { useState } from 'react';
import { Briefcase, Building, Plus, Trash2 } from 'lucide-react';
import { Experience } from '../../lib/types';

interface ExperienceTabProps {
  experience: Experience[];
  isEditing: boolean;
  onExperienceChange: (experience: Experience[]) => void;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ experience, isEditing, onExperienceChange }) => {
  const [newExperience, setNewExperience] = useState<Experience>({
    position: '',
    company: '',
    startDate: '',
    endDate: null,
    description: ''
  });

  const handleAddExperience = () => {
    if (newExperience.position && newExperience.company && newExperience.startDate) {
      onExperienceChange([...experience, { ...newExperience }]);
      setNewExperience({
        position: '',
        company: '',
        startDate: '',
        endDate: null,
        description: ''
      });
    }
  };

  const handleRemoveExperience = (index: number) => {
    onExperienceChange(experience.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Briefcase className="mr-2 text-blue-500" size={20} />
        Work Experience
      </h2>

      {isEditing && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Add Experience</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newExperience.position}
              onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
              placeholder="Position"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newExperience.company}
              onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
              placeholder="Company"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newExperience.startDate}
              onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
              placeholder="Start Date"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newExperience.endDate || ''}
              onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value || null })}
              placeholder="End Date"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <textarea
            value={newExperience.description}
            onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full text-gray-800 bg-white border border-gray-300 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={handleAddExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Experience
          </button>
        </div>
      )}

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="border-l-2 border-blue-500 pl-4 ml-2">
            {isEditing && (
              <button
                onClick={() => handleRemoveExperience(index)}
                className="float-right text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
              <p className="text-blue-600 font-medium">
                {new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{' '}
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
              </p>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Building size={16} className="mr-2" />
              <span>{exp.company}</span>
            </div>
            <p className="text-gray-600">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTab;