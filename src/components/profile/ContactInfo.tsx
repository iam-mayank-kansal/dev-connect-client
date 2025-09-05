"use client";

import React from 'react';
import { Mail, Phone, Calendar, User } from 'lucide-react';
import { UserProfile } from '../../lib/types';

interface ContactInfoProps {
  profile: UserProfile;
  tempProfile: UserProfile;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ profile, tempProfile, isEditing, onInputChange }) => {
  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <User className="mr-2 text-blue-500" size={20} />
        Contact Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center">
          <Mail className="text-gray-400 mr-3" size={18} />
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <p className="text-gray-800">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Phone className="text-gray-400 mr-3" size={18} />
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Mobile</label>
            {isEditing ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempProfile.mobile.countryCode}
                  onChange={(e) => onInputChange('mobile.countryCode', e.target.value)}
                  className="block w-20 text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1"
                />
                <input
                  type="tel"
                  value={tempProfile.mobile.number}
                  onChange={(e) => onInputChange('mobile.number', e.target.value)}
                  className="block flex-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <p className="text-gray-800">{`${profile.mobile.countryCode} ${profile.mobile.number}`}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <Calendar className="text-gray-400 mr-3" size={18} />
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Date of Birth</label>
            {isEditing ? (
              <input
                type="date"
                value={tempProfile.dob.split('T')[0]}
                onChange={(e) => onInputChange('dob', e.target.value)}
                className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-800">{new Date(profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <User className="text-gray-400 mr-3" size={18} />
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Age</label>
            <p className="text-gray-800">{calculateAge(tempProfile.dob)} years</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;