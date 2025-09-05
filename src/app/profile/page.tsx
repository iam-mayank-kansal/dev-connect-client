"use client"

import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Download, Send } from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/lib/api';
import { UserProfile as UserProfileType, Education, Experience, Certification } from '@/lib/types';
import ProfilePicture from '@/components/profile/ProfilePicture';
import BasicInfo from '@/components/profile/BasicInfo';
import ContactInfo from '@/components/profile/ContactInfo';
import ProfessionalInfo from '@/components/profile/ProfessionalInfo';
import SkillsTab from '@/components/profile/SkillsTab';
import EducationTab from '@/components/profile/EducationTab';
import ExperienceTab from '@/components/profile/ExperienceTab';
import CertificationsTab from '@/components/profile/CertificationsTab'; // New import

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      if (response.data.status === 'success') {
        const data = response.data.data;
        const sanitizedData: UserProfileType = {
          ...data,
          mobile: data.mobile || { countryCode: '', number: '' },
          location: data.location || { country: '', state: '', city: '', address: '' },
          socialLinks: data.socialLinks || [],
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
          certification: data.certification || [],
        };
        setProfile(sanitizedData);
        setTempProfile(sanitizedData);
      } else {
        setError('Failed to fetch profile data');
      }
    } catch (err) {
      setError('Error fetching profile data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setTempProfile((prev) => {
      if (!prev) return null;
      const newProfile = { ...prev };
      const fields = field.split('.');
      let current: any = newProfile;

      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }

      current[fields[fields.length - 1]] = value;
      return newProfile;
    });
  };

  const handleSocialLinkChange = (index: number, platform: string, url: string | null) => {
    setTempProfile((prev) => {
      if (!prev) return null;
      const newSocialLinks = [...(prev.socialLinks || [])];
      if (url === null) {
        newSocialLinks.splice(index, 1);
      } else {
        newSocialLinks[index] = { platform, url };
      }
      return { ...prev, socialLinks: newSocialLinks };
    });
  };

  const handleSkillsChange = (skills: string[]) => {
    setTempProfile((prev) => (prev ? { ...prev, skills } : null));
  };

  const handleEducationChange = (education: Education[]) => {
    setTempProfile((prev) => (prev ? { ...prev, education } : null));
  };

  const handleExperienceChange = (experience: Experience[]) => {
    setTempProfile((prev) => (prev ? { ...prev, experience } : null));
  };

  const handleCertificationChange = (certification: Certification[]) => {
    setTempProfile((prev) => (prev ? { ...prev, certification } : null));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setTempProfile((prev) => (
          prev ? { ...prev, profilePicture: e.target.result } : null
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
  if (!tempProfile) return;
  try {
    setLoading(true);

    // Create a new object with only the allowed fields
    const updatedProfile = {
      name: tempProfile.name,
      mobile: tempProfile.mobile,
      bio: tempProfile.bio,
      dob: tempProfile.dob,
      designation: tempProfile.designation,
      profilePicture: tempProfile.profilePicture,
      location: tempProfile.location,
      socialLinks: tempProfile.socialLinks,
      skills: tempProfile.skills,
      education: tempProfile.education,
      experience: tempProfile.experience,
      certification: tempProfile.certification,
      // Do NOT include _id, email, createdAt, or age
    };

    const response = await updateUserProfile(updatedProfile);
    if (response.data.status === 'success') {
      setProfile(tempProfile);
      setIsEditing(false);
    } else {
      setError('Failed to update profile');
    }
  } catch (err) {
    setError('Error updating profile');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No profile data available.</p>
          <button
            onClick={fetchUserProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Professional Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              <Edit3 size={18} className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'experience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('experience')}
            >
              Experience
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'skills' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'education' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('education')}
            >
              Education
            </button>
            <button
              className={`px-6 py-3 font-medium ${activeTab === 'certifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('certifications')}
            >
              Certifications
            </button>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'profile' && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-start">
                  <ProfilePicture
                    profilePicture={isEditing && tempProfile ? tempProfile.profilePicture : profile.profilePicture}
                    isEditing={isEditing}
                    onImageUpload={handleImageUpload}
                  />
                  <BasicInfo
                    profile={profile}
                    tempProfile={tempProfile as UserProfileType}
                    isEditing={isEditing}
                    onInputChange={handleInputChange}
                  />
                  <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <button className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                      <Download size={16} className="mr-2" />
                      Download CV
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Send size={16} className="mr-2" />
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <ContactInfo
                profile={profile}
                tempProfile={tempProfile as UserProfileType}
                isEditing={isEditing}
                onInputChange={handleInputChange}
              />
              <ProfessionalInfo
                profile={profile}
                tempProfile={tempProfile as UserProfileType}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onSocialLinkChange={handleSocialLinkChange}
              />
            </div>
          </>
        )}

        {activeTab === 'experience' && profile && tempProfile && (
          <ExperienceTab
            experience={tempProfile.experience}
            isEditing={isEditing}
            onExperienceChange={handleExperienceChange}
          />
        )}
        {activeTab === 'skills' && profile && tempProfile && (
          <SkillsTab
            skills={tempProfile.skills}
            isEditing={isEditing}
            onSkillsChange={handleSkillsChange}
          />
        )}
        {activeTab === 'education' && profile && tempProfile && (
          <EducationTab
            education={tempProfile.education}
            isEditing={isEditing}
            onEducationChange={handleEducationChange}
          />
        )}
        {activeTab === 'certifications' && profile && tempProfile && (
          <CertificationsTab
            certification={tempProfile.certification}
            isEditing={isEditing}
            onCertificationChange={handleCertificationChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;