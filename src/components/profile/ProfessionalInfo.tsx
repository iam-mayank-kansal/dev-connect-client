"use client";

import React from 'react';
import { Briefcase, FileText, Linkedin, Github, Globe, Plus, Trash2 } from 'lucide-react';
import { UserProfile, SocialLink } from '../../lib/types';

interface ProfessionalInfoProps {
  profile: UserProfile;
  tempProfile: UserProfile;
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
  onSocialLinkChange: (index: number, platform: string, url: string | null) => void;
}

const ProfessionalInfo: React.FC<ProfessionalInfoProps> = ({ profile, tempProfile, isEditing, onInputChange, onSocialLinkChange }) => {
  const socialPlatforms = ['LinkedIn', 'GitHub', 'Twitter', 'Facebook', 'Instagram', 'Website'];
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Briefcase className="mr-2 text-blue-500" size={20} />
        Professional Details
      </h2>
      <div className="space-y-4">
        <div className="flex items-start">
          <FileText className="text-gray-400 mr-3 mt-1" size={18} />
          <div className="flex-1">
            <label className="text-xs text-gray-500 block mb-1">Bio</label>
            {isEditing ? (
              <textarea
                value={tempProfile.bio}
                onChange={(e) => onInputChange('bio', e.target.value)}
                rows={4}
                className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-gray-800 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Social Links</label>
          {isEditing ? (
            <div className="space-y-3">
              {(tempProfile.socialLinks || []).map((link: SocialLink, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <select
                    value={link.platform}
                    onChange={(e) => onSocialLinkChange(index, e.target.value, link.url)}
                    className="block w-28 text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {socialPlatforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => onSocialLinkChange(index, link.platform, e.target.value)}
                    className="block flex-1 text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${link.platform} URL`}
                  />
                  <button
                    onClick={() => onSocialLinkChange(index, link.platform, null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onSocialLinkChange(tempProfile.socialLinks ? tempProfile.socialLinks.length : 0, 'LinkedIn', '')}
                className="flex items-center text-blue-600 text-sm mt-2"
              >
                <Plus size={16} className="mr-1" />
                Add Social Link
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {(profile.socialLinks || []).map((link: SocialLink, index: number) => {
                let icon;
                switch (link.platform) {
                  case 'LinkedIn': icon = <Linkedin className="text-gray-400 mr-3" size={18} />; break;
                  case 'GitHub': icon = <Github className="text-gray-400 mr-3" size={18} />; break;
                  default: icon = <Globe className="text-gray-400 mr-3" size={18} />;
                }
                return (
                  <div key={index} className="flex items-center">
                    {icon}
                    <div className="flex-1">
                      <p className="text-gray-800">{link.url}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfo;