'use client';
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
import SectionHeader from './SectionHeader';
import SectionCard from './SectionCard';
import {
  Certification,
  Education,
  Experience,
  SocialLink,
  UserProfile,
} from '@/lib/types/user';
import { useUser } from '@/utils/context/user-context';
import { useEffect, useState } from 'react';
import z, { ZodError } from 'zod';
import { userProfileSchema } from '@/lib/profile/zod-validation';
import { updateUserProfile } from '@/lib/api';
import Image from 'next/image';
import { getImageUrl } from '@/utils/helper/getImageUrl';

const UserProfileEdit = ({
  user,
  onSaveSuccess,
  onCancel,
}: {
  user: UserProfile;
  onSaveSuccess: () => void;
  onCancel: () => void;
}) => {
  const { triggerRefresh } = useUser();
  const [localUser, setLocalUser] = useState(user);
  const [skillInput, setSkillInput] = useState<string>('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [errors, setErrors] = useState<z.ZodError | null>(null);

  // Form field styles
  const inputStyle =
    'block border-2 w-full p-3 text-sm text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500';
  const labelStyle = 'block text-sm font-medium text-gray-700 mb-1';

  // Sync prop changes with local state (e.g., if user data is refetched)
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

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
      if (!prev) return prev;
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

  // add new item to array for education, experience, certification and socialLinks
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

  // remove items from array for education, experience, certification and socialLinks
  const removeArrayItem = (section: keyof UserProfile, index: number) => {
    setLocalUser((prev) => {
      if (!prev) return prev;
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
    }
  };

  // handle removing skills from skills array in user state
  const handleRemoveSkill = (index: number) => {
    setLocalUser((prev) => {
      if (!prev) return prev;
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

      await updateUserProfile(userUpdateData);

      triggerRefresh(); // Trigger a refetch from the context
      setErrors(null);
      onSaveSuccess(); // Call the callback to exit edit mode
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof z.ZodError) {
        setErrors(error);
      } else {
        console.error('Failed to update profile. Please try again.');
      }
    }
  };

  // handle cancel edits and revert to last saved state
  const handleCancel = () => {
    setResumeFile(null);
    setProfilePictureFile(null);
    setErrors(null);
    setLocalUser(user); // Revert to the original user data
    onCancel(); // Call the callback to exit edit mode
  };

  // determine profile image source
  const profileImageSrc = profilePictureFile
    ? URL.createObjectURL(profilePictureFile)
    : localUser.profilePicture
      ? getImageUrl(localUser?.profilePicture, 'profilePicture')
      : '';

  const getErrorMessage = (fieldPath: string, errors: ZodError | null) => {
    if (!errors) return '';
    const pathParts = fieldPath.split('.');
    const error = errors.issues.find(
      (e) =>
        e.path.length === pathParts.length &&
        e.path.every((part, i) => String(part) === pathParts[i])
    );
    return error ? error.message : '';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 bg-white text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          {/* --- Header / Basic Info --- */}
          <SectionCard>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="relative">
                  {profileImageSrc ? (
                    <Image
                      src={profileImageSrc}
                      alt="Profile"
                      width={144}
                      height={144}
                      className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer hover:bg-blue-700 shadow">
                    <Edit size={16} />
                    <input
                      type="file"
                      name="profilePicture"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
              <div className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <label className={labelStyle}>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={localUser.name}
                      onChange={handleChange}
                      className={inputStyle}
                      required
                    />
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage('name', errors)}
                    </p>
                  </div>
                  <div>
                    <label className={labelStyle}>Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={localUser.designation}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className={labelStyle}>Bio</label>
              <textarea
                name="bio"
                value={localUser.bio}
                onChange={handleChange}
                rows={4}
                className={inputStyle}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail size={20} className="text-gray-500" />
                  Contact Information
                </h3>
                <div className="space-y-4 pl-7">
                  <div className="flex items-center gap-3 text-gray-500 bg-gray-100 p-2 rounded-lg">
                    <Mail size={16} />
                    <span>{localUser.email} (cannot be changed)</span>
                  </div>
                  <div>
                    <label className={labelStyle}>Mobile</label>
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
                        className={`block border-2 p-3 text-sm text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 w-20`}
                        placeholder="+91"
                      />
                      <input
                        type="tel"
                        value={localUser.mobile.number}
                        onChange={(e) =>
                          handleNestedChange('mobile', 'number', e.target.value)
                        }
                        className={`${inputStyle} flex-1`}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-500" />
                  Location
                </h3>
                <div className="space-y-4 pl-7">
                  <input
                    type="text"
                    value={localUser.location.address}
                    onChange={(e) =>
                      handleNestedChange('location', 'address', e.target.value)
                    }
                    className={inputStyle}
                    placeholder="Address"
                  />
                  <input
                    type="text"
                    value={localUser.location.city}
                    onChange={(e) =>
                      handleNestedChange('location', 'city', e.target.value)
                    }
                    className={inputStyle}
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={localUser.location.state}
                    onChange={(e) =>
                      handleNestedChange('location', 'state', e.target.value)
                    }
                    className={inputStyle}
                    placeholder="State"
                  />
                  <input
                    type="text"
                    value={localUser.location.country}
                    onChange={(e) =>
                      handleNestedChange('location', 'country', e.target.value)
                    }
                    className={inputStyle}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe size={20} className="text-gray-500" />
                  Social Links
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    addArrayItem('socialLinks', { platform: '', url: '' })
                  }
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus size={16} /> Add Link
                </button>
              </div>
              <div className="space-y-3 pl-7">
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
                      className={`block border-2 p-3 text-sm text-gray-800 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 w-36`}
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
                      className={`${inputStyle} flex-1`}
                      placeholder="https://"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('socialLinks', index)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <p className="text-red-500 text-sm mt-1">
                  {getErrorMessage('socialLinks', errors)}
                </p>
              </div>
            </div>
          </SectionCard>

          {/* --- Skills --- */}
          <SectionCard>
            <SectionHeader
              icon={<Code size={24} className="text-blue-600" />}
              title="Skills"
            />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Prevent form submission
                      handleAddSkill();
                    }
                  }}
                  className={`${inputStyle} flex-1`}
                  placeholder="Type a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {localUser.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* --- Experience --- */}
          <SectionCard>
            <div className="flex justify-between items-center mb-4">
              <SectionHeader
                icon={<Briefcase size={24} className="text-blue-600" />}
                title="Experience"
              />
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
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Plus size={16} /> Add Experience
              </button>
            </div>
            <div className="space-y-4">
              {localUser.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Position</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Company</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Start Date</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>End Date</label>
                      <input
                        type="date"
                        value={
                          exp.endDate
                            ? new Date(exp.endDate).toISOString().split('T')[0]
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
                        className={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className={labelStyle}>Description</label>
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
                      className={inputStyle}
                    />
                  </div>
                  <div className="text-right mt-3">
                    <button
                      type="button"
                      onClick={() => removeArrayItem('experience', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* --- Education --- */}
          <SectionCard>
            <div className="flex justify-between items-center mb-4">
              <SectionHeader
                icon={<BookOpen size={24} className="text-blue-600" />}
                title="Education"
              />
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
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Plus size={16} /> Add Education
              </button>
            </div>
            <div className="space-y-4">
              {localUser.education.map((edu, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Degree</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Institution</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Start Date</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>End Date</label>
                      <input
                        type="date"
                        value={
                          edu.endDate
                            ? new Date(edu.endDate).toISOString().split('T')[0]
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
                        className={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="text-right mt-3">
                    <button
                      type="button"
                      onClick={() => removeArrayItem('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* --- Certifications --- */}
          <SectionCard>
            <div className="flex justify-between items-center mb-4">
              <SectionHeader
                icon={<Award size={24} className="text-blue-600" />}
                title="Certifications"
              />
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
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <Plus size={16} /> Add Certification
              </button>
            </div>
            <div className="space-y-4">
              {localUser.certification.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyle}>Certificate</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Issuing Company</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Issued By</label>
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
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={labelStyle}>Issue Date</label>
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
                        className={inputStyle}
                      />
                    </div>
                  </div>
                  <div className="text-right mt-3">
                    <button
                      type="button"
                      onClick={() => removeArrayItem('certification', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* --- Resume --- */}
          <SectionCard>
            <SectionHeader
              icon={<FileText size={24} className="text-blue-600" />}
              title="Resume"
            />
            <div>
              <label className={`${labelStyle} mb-2`}>
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                accept=".pdf"
              />
              {resumeFile && (
                <p className="text-sm text-green-600 mt-2">
                  New file selected: {resumeFile.name}
                </p>
              )}
              {localUser.resume &&
                typeof localUser.resume === 'string' &&
                !resumeFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Current file: {localUser.resume.split('/').pop()}
                  </p>
                )}
            </div>
          </SectionCard>
        </form>
      </div>
    </div>
  );
};

export default UserProfileEdit;
