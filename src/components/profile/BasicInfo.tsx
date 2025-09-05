"use client";

import React from 'react';
import { MapPin, FileText, Upload, Trash2 } from 'lucide-react';
import { UserProfile } from '../../lib/types';

interface BasicInfoProps {
  profile: UserProfile;
  tempProfile: UserProfile;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  onResumeUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResumeRemove?: () => void;
  resumeUploading?: boolean;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ 
  profile, 
  tempProfile, 
  isEditing, 
  onInputChange,
  onResumeUpload,
  onResumeRemove,
  resumeUploading = false
}) => {
  const resumeUrl = profile.resume ? `http://localhost:8080/uploads/resume/${profile?.resume}` : null;
  
  return (
    <div className="flex-1">
      {isEditing ? (
        <input
          type="text"
          value={tempProfile.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h1>
      )}

      {isEditing ? (
        <input
          type="text"
          value={tempProfile.designation}
          onChange={(e) => onInputChange('designation', e.target.value)}
          className="text-lg text-blue-600 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <p className="text-lg text-blue-600 font-medium">{profile.designation}</p>
      )}

      <div className="flex items-center text-gray-500 mt-4">
        <MapPin size={16} className="mr-2" />
        {isEditing ? (
          <input
            type="text"
            value={tempProfile.location.city}
            onChange={(e) => onInputChange('location.city', e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <span className="text-sm">{`${profile.location.city}, ${profile.location.state}, ${profile.location.country}`}</span>
        )}
      </div>

      {resumeUrl && !isEditing && (
        <div className="flex items-center text-gray-500 mt-4">
          <FileText size={16} className="mr-2" />
          <a 
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            View Resume
          </a>
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <label className="flex items-center text-sm text-gray-500 cursor-pointer">
            <Upload size={16} className="mr-2" />
            Upload New Resume
            <input
              type="file"
              accept=".pdf"
              name='resume'
              onChange={onResumeUpload}
              className="hidden"
              disabled={resumeUploading}
            />
          </label>
          {resumeUploading && <p className="text-xs text-gray-500 mt-1">Uploading resume...</p>}
          
          {tempProfile.resume && (
            <button 
              onClick={onResumeRemove}
              disabled={resumeUploading}
              className="flex items-center text-sm text-red-500 mt-2 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} className="mr-2" />
              Remove Current Resume
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BasicInfo;