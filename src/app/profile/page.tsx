"use client";
import { API_BASE_URL, getUserProfile, updateUserProfile } from "@/lib/api";
import { UserProfile } from "@/lib/types";
import { useEffect, useState } from "react";
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
  Trash2
} from "lucide-react";
import Image from "next/image";

function ProfilePage() {
  const defaultUser: UserProfile = {
    _id: "",
    email: "",
    name: "",
    bio: "",
    skills: [],
    education: [
      { degree: "", institution: "", startDate: "", endDate: "" },
    ],
    experience: [
      { position: "", company: "", startDate: "", endDate: "", description: "" },
    ],
    certification: [
      { company: "", certificate: "", issuedBy: "", issueDate: "" },
    ],
    socialLinks: [],
    profilePicture: "",
    resume: null,
    age: 0,
    designation: "",
    dob: "",
    mobile: { countryCode: "+91", number: "" },
    location: { country: "", state: "", city: "", address: "" },
  };

  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoading(true);
        const response = await getUserProfile();
        setUser(response?.data?.data || defaultUser);
      } catch {
        setUser(defaultUser);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (name === "profilePicture") {
        setProfilePictureFile(file);
      } else if (name === "resume") {
        setResumeFile(file);
      }
    }
  };

  const handleNestedChange = (section: string, field: string, value: string, index?: number) => {
    setUser((prev) => {
      const updatedSection = Array.isArray(prev[section as keyof UserProfile])
        ? (prev[section as keyof UserProfile] as any[]).map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
        : { ...(prev[section as keyof UserProfile] as object), [field]: value };
      return { ...prev, [section]: updatedSection };
    });
  };

  const addArrayItem = (section: string, template: any) => {
    setUser((prev) => ({
      ...prev,
      [section]: [...prev[section as keyof UserProfile] as any[], template]
    }));
  };

  const removeArrayItem = (section: string, index: number) => {
    setUser((prev) => {
      const updatedArray = [...prev[section as keyof UserProfile] as any[]];
      updatedArray.splice(index, 1);
      return { ...prev, [section]: updatedArray };
    });
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      const newSkill = skillInput.trim();
      setUser((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setUser((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return { ...prev, skills: updatedSkills };
    });
  };

 const handleSave = async (e: React.FormEvent) => {
  
   
   e.preventDefault();
   try {
    setIsLoading(true);
    
    // Base update data (always include these fields)
    const updateUserData: any = {
      name: user.name,
      bio: user.bio,
      dob: user.dob,
      designation: user.designation,
      location: user.location,
      mobile: user.mobile,
      socialLinks: user.socialLinks,
      skills: user.skills,
      education: user.education,
      experience: user.experience,
      certification: user.certification,
    };

    // Only include files if they were actually selected/changed
    if (profilePictureFile != null && profilePictureFile instanceof File) {
      updateUserData.profilePicture = profilePictureFile;
    }
    
    if (resumeFile != null && resumeFile instanceof File) {
      updateUserData.resume = resumeFile;
    }
    
    console.log("Updating user with data:", updateUserData);

    await updateUserProfile(updateUserData);
    setIsEditing(false);

    // Refetch user data to get updated info
    const response = await getUserProfile();
    setUser(response?.data?.data || user);

    console.log("Profile updated successfully", response?.data?.data);

    // Reset file states after successful save
    setProfilePictureFile(null);
    setResumeFile(null); 
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    // Reset file states to null to discard unsaved file selections
    setResumeFile(null);
    setProfilePictureFile(null);
    setIsLoading(true);
    getUserProfile().then(response => {
      setUser(response?.data?.data || defaultUser);
    }).catch(() => {
      setUser(defaultUser);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Determine which image URL to display
  const profileImageSrc = profilePictureFile
    ? URL.createObjectURL(profilePictureFile)
    : user.profilePicture
      ? `${API_BASE_URL}/uploads/profilePicture/${user.profilePicture}`
      : '';

  // Determine which resume file name to display
  const resumeFileName = resumeFile
    ? resumeFile.name
    : user.resume
      ? (typeof user.resume === 'string' ? user.resume.split('/').pop() : 'N/A')
      : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
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

              {/* Basic Info */}
              <div className="flex-grow">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        value={user.designation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    {user.designation && (
                      <p className="text-lg text-gray-600">{user.designation}</p>
                    )}
                    {user.bio && (
                      <p className="text-gray-700 mt-2">{user.bio}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-100">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail size={20} />
                  Contact Information
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{user.email}</span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={user.mobile.countryCode}
                            onChange={(e) => handleNestedChange('mobile', 'countryCode', e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+91"
                          />
                          <input
                            type="tel"
                            value={user.mobile.number}
                            onChange={(e) => handleNestedChange('mobile', 'number', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Phone number"
                          />
                        </div>
                      </div>
                    </div>
                  ) : user.mobile.number ? (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} />
                      <span>{user.mobile.countryCode} {user.mobile.number}</span>
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
                      value={user.location.country}
                      onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Country"
                    />
                    <input
                      type="text"
                      value={user.location.state}
                      onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={user.location.city}
                      onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={user.location.address}
                      onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Address"
                    />
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {user.location.address && <p>{user.location.address}</p>}
                    {user.location.city && <p>{user.location.city}</p>}
                    {user.location.state && <p>{user.location.state}</p>}
                    {user.location.country && <p>{user.location.country}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Globe size={20} />
                  Social Links
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('socialLinks', { platform: '', url: '' })}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Plus size={16} /> Add Link
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  {user.socialLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={link.platform}
                        onChange={(e) => handleNestedChange('socialLinks', 'platform', e.target.value, index)}
                        className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Platform</option>
                        <option value="GitHub">GitHub</option>
                        <option value="LinkedIn">LinkedIn</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleNestedChange('socialLinks', 'url', e.target.value, index)}
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
                </div>
              ) : (
                <div className="flex gap-4">
                  {user.socialLinks.map((link, index) => (
                    link.url && (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {link.platform === 'GitHub' && <Github size={20} />}
                        {link.platform === 'LinkedIn' && <Linkedin size={20} />}
                        {!['GitHub', 'LinkedIn'].includes(link.platform) && <Globe size={20} />}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
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
                    onKeyDown={handleAddSkill}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type a skill and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim() !== '') {
                        setUser((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
                        setSkillInput('');
                      }
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
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
            ) : user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen size={20} />
                Education
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => addArrayItem('education', { degree: "", institution: "", startDate: "", endDate: "" })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Education
                </button>
              )}
            </div>

            {user.education.length > 0 && user.education.some(edu => edu.degree || edu.institution) ? (
              <div className="space-y-4">
                {user.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => handleNestedChange('education', 'degree', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => handleNestedChange('education', 'institution', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleNestedChange('education', 'startDate', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleNestedChange('education', 'endDate', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-gray-600">
                            {edu.startDate && (
                              <p>{new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No education information added yet.</p>
            )}
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase size={20} />
                Experience
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => addArrayItem('experience', { position: "", company: "", startDate: "", endDate: "", description: "" })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Experience
                </button>
              )}
            </div>

            {user.experience.length > 0 && user.experience.some(exp => exp.position || exp.company) ? (
              <div className="space-y-4">
                {user.experience.map((exp, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleNestedChange('experience', 'position', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleNestedChange('experience', 'company', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleNestedChange('experience', 'startDate', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => handleNestedChange('experience', 'endDate', e.target.value, index)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Leave empty if current"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => handleNestedChange('experience', 'description', e.target.value, index)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900">{exp.position}</h4>
                        <p className="text-gray-600">{exp.company}</p>
                        {exp.startDate && (
                          <p className="text-gray-500 text-sm mt-1">
                            {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No experience information added yet.</p>
            )}
          </div>

          {/* Certifications Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award size={20} />
                Certifications
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => addArrayItem('certification', { company: "", certificate: "", issuedBy: "", issueDate: "" })}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Add Certification
                </button>
              )}
            </div>

            {user.certification.length > 0 && user.certification.some(cert => cert.certificate || cert.company) ? (
              <div className="space-y-4">
                {user.certification.map((cert, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    {isEditing && (
                      <div className="flex justify-end mb-2">
                        <button
                          type="button"
                          onClick={() => removeArrayItem('certification', index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate</label>
                          <input
                            type="text"
                            value={cert.certificate}
                            onChange={(e) => handleNestedChange('certification', 'certificate', e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Company</label>
                          <input
                            type="text"
                            value={cert.company}
                            onChange={(e) => handleNestedChange('certification', 'company', e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issued By</label>
                          <input
                            type="text"
                            value={cert.issuedBy}
                            onChange={(e) => handleNestedChange('certification', 'issuedBy', e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                          <input
                            type="date"
                            value={cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : ''}
                            onChange={(e) => handleNestedChange('certification', 'issueDate', e.target.value, index)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-medium text-gray-900">{cert.certificate}</h4>
                        <p className="text-gray-600">{cert.company}</p>
                        {cert.issuedBy && (
                          <p className="text-gray-500 text-sm mt-1">Issued by: {cert.issuedBy}</p>
                        )}
                        {cert.issueDate && (
                          <p className="text-gray-500 text-sm mt-1">
                            Issued on: {new Date(cert.issueDate).toLocaleDateString()}
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

          {/* Resume Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Resume
            </h3>

            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleFileChange}
                  className="w-full text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf"
                />
                {resumeFile && (
                  <p className="text-sm text-gray-500 mt-2">New file selected: {resumeFile.name}</p>
                )}
                {user.resume && (
                  <p className="text-sm text-gray-500 mt-2">Current file: {typeof user.resume === 'string' ? user.resume.split('/').pop() : 'N/A'}</p>
                )}
              </div>
            ) : (user.resume || resumeFile) ? (
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-gray-600" />
                <span className="text-gray-700">
                  {resumeFileName}
                </span>
                <a
                  href={`${API_BASE_URL}/uploads/resume/${user.resume}`}
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