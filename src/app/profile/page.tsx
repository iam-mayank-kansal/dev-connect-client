'use client';

import { updateUserProfile } from '@/lib/api';
import {
  Certification,
  Education,
  Experience,
  SocialLink,
  UserProfile,
} from '@/lib/types/user';
import { useEffect, useState } from 'react';
import { z, ZodError } from 'zod';
import {
  Edit,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Award,
  Github,
  Linkedin,
  Download,
  User,
  Code,
  FileText,
  Globe,
  Plus,
  Trash2,
  Instagram,
  Twitter,
  Youtube,
} from 'lucide-react';
import Image from 'next/image';
import { userProfileSchema } from '@/lib/profile/zod-validation';
import { useRouter } from 'next/navigation';
import { useUser } from '@/utils/context/user-context';
import { getImageUrl } from '@/lib/utils';

function ProfilePage() {
  const { user, isLoading, triggerRefresh } = useUser(); // Use the context hook
  const router = useRouter();

  const [localUser, setLocalUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  // Sync context user with local state for editing
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  // Handle redirection if user is null after initial load
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  // Handle input change for text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalUser((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  // handle input change for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (name === 'profilePicture') {
        setProfilePictureFile(file);
      } else if (name === 'resume') {
        setResumeFile(file);
      }
    }
  };

  const handleNestedChange = (
    section: keyof UserProfile,
    field: string,
    value: string,
    index?: number
  ) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      if (
        typeof prev[section] === 'object' &&
        prev[section] !== null &&
        !Array.isArray(prev[section])
      ) {
        // Handle nested objects like mobile and location
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      } else if (Array.isArray(prev[section]) && index !== undefined) {
        // Handle arrays of objects like education, experience, etc.
        const updatedArray = (
          prev[section] as
            | Education[]
            | Certification[]
            | Experience[]
            | SocialLink[]
        ).map((item, i) => (i === index ? { ...item, [field]: value } : item));
        return { ...prev, [section]: updatedArray };
      }
      return prev;
    });
  };

  // add new item to array for education, experience, certification and socialLinks and also updating state
  const addArrayItem = (
    section: keyof UserProfile,
    template: Education | Certification | Experience | SocialLink
  ) => {
    setLocalUser((prev) =>
      prev
        ? {
            ...prev,
            [section]: [
              ...(prev[section] as
                | Education[]
                | Certification[]
                | Experience[]
                | SocialLink[]),
              template,
            ],
          }
        : prev
    );
  };

  // remove items from array for education, experience, certification and socialLinks and also updating state on basis of index
  const removeArrayItem = (section: keyof UserProfile, index: number) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      const updatedArray = [
        ...(prev[section] as
          | Education[]
          | Certification[]
          | Experience[]
          | SocialLink[]),
      ];
      updatedArray.splice(index, 1);
      return { ...prev, [section]: updatedArray };
    });
  };

  // handle adding skills to skills array in user state
  const handleAddSkill = () => {
    if (skillInput.trim() !== '') {
      setLocalUser((prev) =>
        prev
          ? {
              ...prev,
              skills: [...prev.skills, skillInput.trim()],
            }
          : prev
      );
      setSkillInput('');
    } else {
      alert('Skill cannot be empty');
    }
  };

  // handle removing skills from skills array in user state on basis of index
  const handleRemoveSkill = (index: number) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return { ...prev, skills: updatedSkills };
    });
  };

  // when user save the profile change
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localUser) return;

    try {
      const userUpdateData: Partial<UserProfile> = {
        name: localUser.name,
        bio: localUser.bio,
        designation: localUser.designation,
        mobile: {
          countryCode: localUser.mobile.countryCode,
          number: localUser.mobile.number,
        },
        location: {
          country: localUser.location.country,
          state: localUser.location.state,
          city: localUser.location.city,
          address: localUser.location.address,
        },
        skills: localUser.skills.filter((skill) => skill.trim() !== ''),
        education: localUser.education.filter(
          (edu) => edu.degree || edu.institution
        ),
        experience: localUser.experience.filter(
          (exp) => exp.position || exp.company
        ),
        certification: localUser.certification.filter(
          (cert) => cert.certificate || cert.company
        ),
        socialLinks: localUser.socialLinks.filter(
          (link) => link.platform && link.url
        ),
      };

      if (profilePictureFile) {
        userUpdateData.profilePicture = profilePictureFile;
      }
      if (resumeFile) {
        userUpdateData.resume = resumeFile;
      }

      userProfileSchema.parse(userUpdateData);

      // You might need to add an `updateUser` function to your context to manage this
      await updateUserProfile(userUpdateData);

      triggerRefresh(); // Trigger a refetch from the context
      setIsEditing(false);
      setErrors(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof z.ZodError) {
        setErrors(error);
        alert(`Validation failed`);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  // handle cancel edits and revert to last saved state
  const handleCancel = () => {
    setIsEditing(false);
    setResumeFile(null);
    setProfilePictureFile(null);
    setErrors(null);
    setLocalUser(user); // Revert to the user data from context
  };

  if (isLoading || !localUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // determine profile image source
  const profileImageSrc = profilePictureFile
    ? URL.createObjectURL(profilePictureFile)
    : localUser.profilePicture
      ? getImageUrl(localUser.profilePicture, 'profilePicture')
      : '';

  // determine resume file name
  const resumeFileName = resumeFile
    ? resumeFile.name
    : localUser.resume
      ? typeof localUser.resume === 'string'
        ? localUser.resume.split('/').pop()
        : 'N/A'
      : 'N/A';

  const getErrorMessage = (field: string, errors: ZodError) => {
    // Return an empty string if there are no errors
    if (!errors || errors.issues.length === 0) {
      return '';
    }
    // Find the first error in the issues array that matches the field
    const error = errors.issues.find((e) =>
      e.path.some((p) => typeof p === 'string' && p === field)
    );
    // Return the error message or an empty string if no error is found
    return error ? error.message : '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit size={18} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                      <Edit size={16} />
                      <input
                        type="file"
                        name="profilePicture"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex-grow">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={localUser.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      {errors && (
                        <p className="text-red-500 text-sm mt-1">
                          {getErrorMessage('name', errors)}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={localUser.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={localUser.designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {localUser.name}
                    </h2>
                    {localUser.designation && (
                      <p className="text-lg text-gray-600">
                        {localUser.designation}
                      </p>
                    )}
                    {localUser.bio && (
                      <p className="text-gray-700 mt-2">{localUser.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail size={20} />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{localUser.email}</span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={localUser.mobile.countryCode}
                            onChange={(e) =>
                              handleNestedChange(
                                'mobile',
                                'countryCode',
                                e.target.value
                              )
                            }
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+91"
                          />
                          <input
                            type="tel"
                            value={localUser.mobile.number}
                            onChange={(e) =>
                              handleNestedChange(
                                'mobile',
                                'number',
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>
                    </div>
                  ) : localUser.mobile && localUser.mobile.number ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>
                        {localUser.mobile.countryCode} {localUser.mobile.number}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} />
                  Location
                </h3>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={localUser.location.country}
                      onChange={(e) =>
                        handleNestedChange(
                          'location',
                          'country',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Country"
                    />
                    <input
                      type="text"
                      value={localUser.location.state}
                      onChange={(e) =>
                        handleNestedChange('location', 'state', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={localUser.location.city}
                      onChange={(e) =>
                        handleNestedChange('location', 'city', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={localUser.location.address}
                      onChange={(e) =>
                        handleNestedChange(
                          'location',
                          'address',
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Address"
                    />
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {localUser.location.address && (
                      <p>{localUser.location.address}</p>
                    )}
                    {localUser.location.city && (
                      <p>{localUser.location.city}</p>
                    )}
                    {localUser.location.state && (
                      <p>{localUser.location.state}</p>
                    )}
                    {localUser.location.country && (
                      <p>{localUser.location.country}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe size={20} />
                  Social Links
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem('socialLinks', { platform: '', url: '' })
                    }
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Plus size={16} /> Add Link
                  </button>
                )}
              </div>
              {isEditing ? (
                <div className="space-y-3">
                  {localUser.socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={link.platform}
                        onChange={(e) =>
                          handleNestedChange(
                            'socialLinks',
                            'platform',
                            e.target.value,
                            index
                          )
                        }
                        className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Platform</option>
                        <option value="GitHub">GitHub</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="Youtube">Youtube</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          handleNestedChange(
                            'socialLinks',
                            'url',
                            e.target.value,
                            index
                          )
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('socialLinks', index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {errors && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage('socialLinks', errors)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  {localUser.socialLinks.map(
                    (link, index) =>
                      link.url && (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          {link.platform === 'GitHub' && <Github size={20} />}
                          {link.platform === 'LinkedIn' && (
                            <Linkedin size={20} />
                          )}
                          {link.platform === 'Instagram' && (
                            <Instagram size={20} />
                          )}
                          {link.platform === 'Twitter' && <Twitter size={20} />}
                          {link.platform === 'Youtube' && <Youtube size={20} />}
                          {![
                            'GitHub',
                            'LinkedIn',
                            'Instagram',
                            'Twitter',
                            'Youtube',
                          ].includes(link.platform) && <Globe size={20} />}
                        </a>
                      )
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Code size={20} />
              Skills
            </h3>
            {isEditing ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localUser.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : localUser.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {localUser.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} />
                Education
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('education', {
                      degree: '',
                      institution: '',
                      startDate: '',
                      endDate: '',
                    })
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Education
                </button>
              )}
            </div>
            {localUser.education.length > 0 ? (
              <div className="space-y-4">
                {localUser.education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    {isEditing && (
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() => removeArrayItem('education', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {isEditing ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Degree
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                handleNestedChange(
                                  'education',
                                  'degree',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `education.${index}.degree`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Institution
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                handleNestedChange(
                                  'education',
                                  'institution',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `education.${index}.institution`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={
                                edu.startDate
                                  ? new Date(edu.startDate)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  'education',
                                  'startDate',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `education.${index}.startDate`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={
                                edu.endDate
                                  ? new Date(edu.endDate)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  'education',
                                  'endDate',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {edu.degree}
                            </h4>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-gray-600">
                            {edu.startDate && (
                              <p>
                                {new Date(edu.startDate).toLocaleDateString()} -{' '}
                                {edu.endDate
                                  ? new Date(edu.endDate).toLocaleDateString()
                                  : 'Present'}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No education information added yet.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} />
                Experience
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('experience', {
                      position: '',
                      company: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                    })
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Experience
                </button>
              )}
            </div>
            {localUser.experience.length > 0 ? (
              <div className="space-y-4">
                {localUser.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    {isEditing && (
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experience', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Position
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) =>
                                handleNestedChange(
                                  'experience',
                                  'position',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `experience.${index}.position`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                handleNestedChange(
                                  'experience',
                                  'company',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `experience.${index}.company`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={
                                exp.startDate
                                  ? new Date(exp.startDate)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  'experience',
                                  'startDate',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors && (
                              <p className="text-red-500 text-sm mt-1">
                                {getErrorMessage(
                                  `experience.${index}.startDate`,
                                  errors
                                )}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={
                                exp.endDate
                                  ? new Date(exp.endDate)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  'experience',
                                  'endDate',
                                  e.target.value,
                                  index
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Leave empty if current"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              handleNestedChange(
                                'experience',
                                'description',
                                e.target.value,
                                index
                              )
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {exp.position}
                        </h4>
                        <p className="text-gray-600">{exp.company}</p>
                        {exp.startDate && (
                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(exp.startDate).toLocaleDateString()} -{' '}
                            {exp.endDate
                              ? new Date(exp.endDate).toLocaleDateString()
                              : 'Present'}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-gray-700 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No experience information added yet.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award size={20} />
                Certifications
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('certification', {
                      company: '',
                      certificate: '',
                      issuedBy: '',
                      issueDate: '',
                    })
                  }
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Certification
                </button>
              )}
            </div>
            {localUser.certification.length > 0 ? (
              <div className="space-y-4">
                {localUser.certification.map((cert, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    {isEditing && (
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem('certification', index)
                          }
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Certificate
                          </label>
                          <input
                            type="text"
                            value={cert.certificate}
                            onChange={(e) =>
                              handleNestedChange(
                                'certification',
                                'certificate',
                                e.target.value,
                                index
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {getErrorMessage(
                                `certification.${index}.certificate`,
                                errors
                              )}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issuing Company
                          </label>
                          <input
                            type="text"
                            value={cert.company}
                            onChange={(e) =>
                              handleNestedChange(
                                'certification',
                                'company',
                                e.target.value,
                                index
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {getErrorMessage(
                                `certification.${index}.company`,
                                errors
                              )}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issued By
                          </label>
                          <input
                            type="text"
                            value={cert.issuedBy}
                            onChange={(e) =>
                              handleNestedChange(
                                'certification',
                                'issuedBy',
                                e.target.value,
                                index
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {getErrorMessage(
                                `certification.${index}.issuedBy`,
                                errors
                              )}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Issue Date
                          </label>
                          <input
                            type="date"
                            value={
                              cert.issueDate
                                ? new Date(cert.issueDate)
                                    .toISOString()
                                    .split('T')[0]
                                : ''
                            }
                            onChange={(e) =>
                              handleNestedChange(
                                'certification',
                                'issueDate',
                                e.target.value,
                                index
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors && (
                            <p className="text-red-500 text-sm mt-1">
                              {getErrorMessage(
                                `certification.${index}.issueDate`,
                                errors
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {cert.certificate}
                        </h4>
                        <p className="text-gray-600">{cert.company}</p>
                        {cert.issuedBy && (
                          <p className="text-gray-500 text-sm mt-1">
                            Issued by: {cert.issuedBy}
                          </p>
                        )}
                        {cert.issueDate && (
                          <p className="text-gray-500 text-sm mt-1">
                            Issued on:{' '}
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No certifications added yet.</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Resume
            </h3>
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Resume (PDF)
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf"
                />
                {resumeFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    New file selected: {resumeFile.name}
                  </p>
                )}
                {localUser.resume && typeof localUser.resume === 'string' && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current file: {localUser.resume.split('/').pop()}
                  </p>
                )}
              </div>
            ) : localUser.resume || resumeFile ? (
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-gray-600" />
                <span className="text-gray-700">{resumeFileName}</span>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/resume/${localUser.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No resume uploaded yet.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
