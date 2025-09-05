"use client";

import React, { useState } from 'react';
import { BookOpen, Award, Plus, Trash2 } from 'lucide-react';
import { Education, Certification } from '../../lib/types';

interface EducationTabProps {
  education: Education[];
  isEditing: boolean;
  onEducationChange: (education: Education[]) => void;
}

const EducationTab: React.FC<EducationTabProps> = ({ education,  isEditing, onEducationChange,}) => {
  const [newEducation, setNewEducation] = useState<Education>({
    degree: '',
    institution: '',
    startDate: '',
    endDate: null
  });

  const [newCertification, setNewCertification] = useState<Certification>({
    company: '',
    certificate: '',
    issuedBy: '',
    issueDate: ''
  });

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.institution && newEducation.startDate) {
      onEducationChange([...education, { ...newEducation }]);
      setNewEducation({
        degree: '',
        institution: '',
        startDate: '',
        endDate: null
      });
    }
  };

  const handleRemoveEducation = (index: number) => {
    onEducationChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <BookOpen className="mr-2 text-blue-500" size={20} />
        Education
      </h2>

      {isEditing && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Add Education</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newEducation.degree}
              onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
              placeholder="Degree"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              placeholder="Institution"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newEducation.startDate}
              onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
              placeholder="Start Date"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newEducation.endDate || ''}
              onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value || null })}
              placeholder="End Date"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddEducation}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Education
          </button>
        </div>
      )}

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="border-l-2 border-blue-500 pl-4 ml-2">
            {isEditing && (
              <button
                onClick={() => handleRemoveEducation(index)}
                className="float-right text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
              <p className="text-blue-600 font-medium">
                {new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} -{' '}
                {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'}
              </p>
            </div>
            <p className="text-gray-600">{edu.institution}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EducationTab;