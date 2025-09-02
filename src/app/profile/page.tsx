"use client"

import React, { useState } from 'react';
import { Camera, Edit3, Mail, Phone, Calendar, User, Briefcase, FileText, Save, X, MapPin, Linkedin, Globe, Github, Award, BookOpen, Users, Download, Send, Building } from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    dob: '1990-05-15',
    mobile: '+1 (555) 123-4567',
    bio: 'Passionate software engineer with 8 years of experience in full-stack development. I love creating innovative solutions and mentoring junior developers. When I\'m not coding, you can find me hiking or reading sci-fi novels.',
    designation: 'Senior Software Engineer',
    department: 'Engineering & Technology',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/sarahjohnson',
    website: 'sarahjohnson.dev',
    github: 'github.com/sarahjohnson',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
  });

  const [skills] = useState([
    { name: 'JavaScript', level: 95 },
    { name: 'React', level: 90 },
    { name: 'Node.js', level: 88 },
    { name: 'TypeScript', level: 85 },
    { name: 'AWS', level: 80 },
    { name: 'UI/UX Design', level: 75 }
  ]);

  const [experience] = useState([
    {
      id: 1,
      position: 'Senior Software Engineer',
      company: 'Tech Innovations Inc.',
      period: '2020 - Present',
      description: 'Lead development of enterprise SaaS products. Mentor junior developers and implement best practices.'
    },
    {
      id: 2,
      position: 'Software Engineer',
      company: 'Digital Solutions LLC',
      period: '2016 - 2020',
      description: 'Developed full-stack web applications. Collaborated with cross-functional teams to deliver projects.'
    },
    {
      id: 3,
      position: 'Junior Developer',
      company: 'WebStart Inc.',
      period: '2014 - 2016',
      description: 'Built responsive websites and maintained existing codebase. Learned industry best practices.'
    }
  ]);

  const [education] = useState([
    {
      id: 1,
      degree: 'M.S. Computer Science',
      institution: 'Stanford University',
      period: '2012 - 2014'
    },
    {
      id: 2,
      degree: 'B.S. Software Engineering',
      institution: 'University of California',
      period: '2008 - 2012'
    }
  ]);

  const [tempProfile, setTempProfile] = useState({ ...profile });

  // Calculate age from date of birth
  const calculateAge = (dob: any) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleInputChange = (field: any, value: any) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setTempProfile((prev: any) => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile({ ...tempProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'profile' && (
          <>
            {/* Main Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
              {/* Profile Section */}
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-start">
                  {/* Profile Picture */}
                  <div className="relative mb-6 md:mb-0 md:mr-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                      <img
                        src={tempProfile.profilePicture}
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
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h1>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="text-lg text-blue-600 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-lg text-blue-600 font-medium">{profile.designation}</p>
                    )}

                    {isEditing ? (
                      <input
                        type="text"
                        value={tempProfile.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="text-gray-600 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-600">{profile.department}</p>
                    )}

                    <div className="flex items-center text-gray-500 mt-4">
                      <MapPin size={16} className="mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempProfile.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-sm">{profile.location}</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
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

            {/* Details Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
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
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempProfile.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-3" size={18} />
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">Mobile</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempProfile.mobile}
                          onChange={(e) => handleInputChange('mobile', e.target.value)}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.mobile}</p>
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
                          value={tempProfile.dob}
                          onChange={(e) => handleInputChange('dob', e.target.value)}
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

              {/* Professional Information */}
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
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-800 leading-relaxed">{profile.bio}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-6">
                    <Linkedin className="text-gray-400 mr-3" size={18} />
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">LinkedIn</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempProfile.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.linkedin}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Github className="text-gray-400 mr-3" size={18} />
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">GitHub</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempProfile.github}
                          onChange={(e) => handleInputChange('github', e.target.value)}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.github}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Globe className="text-gray-400 mr-3" size={18} />
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 block mb-1">Website</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempProfile.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="block w-full text-gray-800 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profile.website}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'experience' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Briefcase className="mr-2 text-blue-500" size={20} />
              Work Experience
            </h2>

            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-blue-500 pl-4 ml-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                    <p className="text-blue-600 font-medium">{exp.period}</p>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Building size={16} className="mr-2" />
                    <span>{exp.company}</span>
                  </div>
                  <p className="text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Award className="mr-2 text-blue-500" size={20} />
              Skills & Expertise
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700 font-medium">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="mr-2 text-blue-500" size={20} />
                Additional Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Agile Methodology', 'Team Leadership', 'Project Management', 'Code Review', 'Mentoring', 'Technical Writing'].map((item, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'education' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <BookOpen className="mr-2 text-blue-500" size={20} />
              Education
            </h2>

            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-blue-500 pl-4 ml-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                    <p className="text-blue-600 font-medium">{edu.period}</p>
                  </div>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="mr-2 text-blue-500" size={20} />
                Certifications
              </h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>AWS Certified Solutions Architect (2022)</li>
                <li>Google Professional Cloud Developer (2021)</li>
                <li>React Advanced Certification (2020)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;