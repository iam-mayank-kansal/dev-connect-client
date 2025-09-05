"use client";

import React from 'react';
import { Camera } from 'lucide-react';

interface ProfilePictureProps {
  profilePicture: string;
  isEditing: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ profilePicture, isEditing, onImageUpload }) => (
  <div className="relative mb-6 md:mb-0 md:mr-8">
    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
      <img
        src={profilePicture ? `http://localhost:8080/uploads/profilePicture/${profilePicture}` : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
    {isEditing && (
      <label className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
        <Camera size={16} />
        <input
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
      </label>
    )}
  </div>
);

export default ProfilePicture;