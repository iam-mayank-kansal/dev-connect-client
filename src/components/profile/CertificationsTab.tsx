"use client";

import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Certification } from '../../lib/types';

interface CertificationsTabProps {
  certification: Certification[];
  isEditing: boolean;
  onCertificationChange: (certification: Certification[]) => void;
}

const CertificationsTab: React.FC<CertificationsTabProps> = ({ certification, isEditing, onCertificationChange }) => {
  const [newCertification, setNewCertification] = useState<Certification>({
    company: '',
    certificate: '',
    issuedBy: '',
    issueDate: ''
  });

  const handleAddCertification = () => {
    if (newCertification.certificate && newCertification.company && newCertification.issueDate) {
      onCertificationChange([...certification, { ...newCertification }]);
      setNewCertification({
        company: '',
        certificate: '',
        issuedBy: '',
        issueDate: ''
      });
    }
  };

  const handleRemoveCertification = (index: number) => {
    onCertificationChange(certification.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Award className="mr-2 text-blue-500" size={20} />
        Certifications
      </h2>

      {isEditing && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Add Certification</h3>
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newCertification.certificate}
              onChange={(e) => setNewCertification({ ...newCertification, certificate: e.target.value })}
              placeholder="Certificate Name"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newCertification.company}
              onChange={(e) => setNewCertification({ ...newCertification, company: e.target.value })}
              placeholder="Issuing Company"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newCertification.issuedBy}
              onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
              placeholder="Issued By"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newCertification.issueDate}
              onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
              placeholder="Issue Date"
              className="text-gray-800 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddCertification}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            Add Certification
          </button>
        </div>
      )}

      <ul className="list-disc list-inside text-gray-600 space-y-1">
        {certification.map((cert, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>
              {cert.certificate} - {cert.company} ({new Date(cert.issueDate).getFullYear()})
            </span>
            {isEditing && (
              <button
                onClick={() => handleRemoveCertification(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CertificationsTab;