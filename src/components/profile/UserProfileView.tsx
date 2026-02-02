'use client';

import { Edit } from 'lucide-react';
import ConnectionActions from './connectionActions';
import { User as UserEntity } from '@/lib/types/entities';
import ViewBasicInfo from './sections/view/ViewBasicInfo';
import ViewSkills from './sections/view/ViewSkills';
import ViewExperience from './sections/view/ViewExperience';
import ViewEducation from './sections/view/ViewEducation';
import ViewCertifications from './sections/view/ViewCertifications';
import ViewResume from './sections/view/ViewResume';
import UserBlogsSlider from './UserBlogsSlider';

// Sub-components

const UserProfileView = ({
  user,
  isOwner,
  onEditClick,
  connectionStatus,
}: {
  user: UserEntity;
  isOwner: boolean;
  onEditClick: () => void;
  connectionStatus: string;
}) => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {isOwner ? (
            <button
              onClick={onEditClick}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          ) : (
            <ConnectionActions status={connectionStatus} userId={user._id} />
          )}
        </div>

        {/* Content Stack */}
        <div className="space-y-6">
          <ViewBasicInfo user={user} />

          <ViewSkills skills={user.skills} />

          <ViewExperience experience={user.experience} />

          <ViewEducation education={user.education} />

          <ViewCertifications certification={user.certification} />

          <ViewResume resume={user.resume} />

          {/* Blogs Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Blogs</h2>
            <UserBlogsSlider userId={user._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
