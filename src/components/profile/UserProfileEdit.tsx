'use client';

import { Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Services & API
import { userService } from '@/services/user/userService';
import {
  User as UserEntity,
  Education,
  Experience,
  Certification,
  SocialLink,
} from '@/lib/types/entities';
import { getErrorMessage } from '@/lib/error-handler';

// Sub-components
import EditBasicInfo from './sections/edit/EditBasicInfo';
import EditContactSocials from './sections/edit/EditContactSocials';
import EditSkills from './sections/edit/EditSkills';
import EditExperience from './sections/edit/EditExperience';
import EditEducation from './sections/edit/EditEducation';
import EditCertifications from './sections/edit/EditCertifications';
import EditResume from './sections/edit/EditResume';

const UserProfileEdit = ({
  user,
  onSaveSuccess,
  onCancel,
}: {
  user: UserEntity;
  onSaveSuccess: (updatedUser: UserEntity) => void;
  onCancel: () => void;
}) => {
  const [localUser, setLocalUser] = useState<UserEntity>(user);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  const updateField = (
    field: keyof UserEntity,
    value: UserEntity[keyof UserEntity]
  ) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (
    section: keyof UserEntity,
    data: UserEntity[keyof UserEntity]
  ) => {
    setLocalUser((prev) => ({ ...prev, [section]: data }));
  };

  const processFileUploads = async (toastId: string) => {
    let profilePicture = localUser.profilePicture;
    let profilePictureId = localUser.profilePictureId;
    let resume = localUser.resume;
    let resumeId = localUser.resumeId;

    if (profilePicFile) {
      if (user.profilePictureId) {
        toast.loading('Cleaning up old profile picture...', { id: toastId });
        await userService.deleteImageKitResource(user.profilePictureId);
      }
      toast.loading('Uploading profile picture...', { id: toastId });
      const res = await userService.uploadFile(
        profilePicFile,
        '/profilePicture'
      );
      profilePicture = res.url;
      profilePictureId = res.fileId;
    }

    // Resume Logic
    if (resumeFile) {
      if (user.resumeId) {
        toast.loading('Cleaning up old resume...', { id: toastId });
        await userService.deleteImageKitResource(user.resumeId);
      }
      toast.loading('Uploading new resume...', { id: toastId });
      const res = await userService.uploadFile(resumeFile, '/resume');
      resume = res.url;
      resumeId = res.fileId;
    }

    return { profilePicture, profilePictureId, resume, resumeId };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = 'profile-update';

    try {
      const fileData = await processFileUploads(toastId);

      const updatePayload = {
        name: localUser.name,
        bio: localUser.bio,
        designation: localUser.designation,
        age: localUser.age,
        dob: localUser.dob,
        mobile: localUser.mobile,
        location: localUser.location,
        skills: localUser.skills,
        education: localUser.education,
        experience: localUser.experience,
        socialLinks: localUser.socialLinks,
        certification: localUser.certification,
        ...fileData,
      };

      toast.loading('Updating profile data...', { id: toastId });

      // 3. API Call
      const updatedUser = await userService.updateUserProfile(updatePayload);

      toast.success('Profile updated!', { id: toastId });
      onSaveSuccess(updatedUser);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6 pb-20">
          {/* Header Bar */}
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100 z-10 py-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg border bg-white hover:bg-gray-50 flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all"
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <EditBasicInfo
            name={localUser.name}
            designation={localUser.designation}
            bio={localUser.bio}
            currentImage={localUser.profilePicture}
            onUpdate={(field: string, value: unknown) =>
              updateField(
                field as keyof UserEntity,
                value as UserEntity[keyof UserEntity]
              )
            }
            onFileChange={setProfilePicFile}
          />

          <EditContactSocials
            mobile={localUser.mobile}
            location={localUser.location}
            socialLinks={localUser.socialLinks}
            onUpdateMobile={(val: UserEntity['mobile']) =>
              updateNestedField('mobile', val)
            }
            onUpdateLocation={(val: UserEntity['location']) =>
              updateNestedField('location', val)
            }
            onUpdateSocials={(val: SocialLink[]) =>
              updateField('socialLinks', val)
            }
          />

          <EditSkills
            skills={localUser.skills}
            onUpdate={(val: string[]) => updateField('skills', val)}
          />

          <EditExperience
            data={localUser.experience || []}
            onUpdate={(val: Experience[]) => updateField('experience', val)}
          />

          <EditEducation
            data={localUser.education || []}
            onUpdate={(val: Education[]) => updateField('education', val)}
          />

          <EditCertifications
            data={localUser.certification || []}
            onUpdate={(val: Certification[]) =>
              updateField('certification', val)
            }
          />

          <EditResume
            currentResumeUrl={localUser.resume}
            selectedFile={resumeFile}
            onFileChange={setResumeFile}
            onUpdate={(val: string) => updateField('resume', val)}
          />
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
