'use client';

import React, { FC } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  BookOpen,
  Award,
  Github,
  Linkedin,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  Code,
  FileText,
  Download,
} from 'lucide-react';
import { UserProfile } from '@/lib/types/user';

interface AboutViewProps {
  profile: UserProfile;
}

const Section: FC<{
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}> = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
      <Icon size={20} />
      {title}
    </h3>
    {children}
  </div>
);

const AboutView: FC<AboutViewProps> = ({ profile }) => {
  const resumeFileName = profile.resume
    ? typeof profile.resume === 'string'
      ? profile.resume.split('/').pop()
      : 'N/A'
    : 'N/A';

  const SocialIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
      case 'GitHub':
        return <Github size={20} />;
      case 'LinkedIn':
        return <Linkedin size={20} />;
      case 'Instagram':
        return <Instagram size={20} />;
      case 'Twitter':
        return <Twitter size={20} />;
      case 'Youtube':
        return <Youtube size={20} />;
      default:
        return <Globe size={20} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="md:col-span-1 space-y-6">
        <Section title="Contact Information" icon={Mail}>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span>{profile.email}</span>
            </div>
            {profile.mobile?.number && (
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>
                  {profile.mobile.countryCode} {profile.mobile.number}
                </span>
              </div>
            )}
          </div>
        </Section>

        <Section title="Location" icon={MapPin}>
          <div className="text-gray-600">
            {profile.location.address && <p>{profile.location.address}</p>}
            {profile.location.city && <p>{profile.location.city}</p>}
            {profile.location.state && <p>{profile.location.state}</p>}
            {profile.location.country && <p>{profile.location.country}</p>}
          </div>
        </Section>

        <Section title="Social Links" icon={Globe}>
          <div className="flex flex-wrap gap-4">
            {profile.socialLinks.map(
              (link, index) =>
                link.url && (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label={link.platform}
                  >
                    <SocialIcon platform={link.platform} />
                  </a>
                )
            )}
          </div>
        </Section>

        {profile.resume && (
          <Section title="Resume" icon={FileText}>
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-gray-600" />
              <span className="text-gray-700 truncate">{resumeFileName}</span>
              <a
                href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/resume/${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Download size={16} />
              </a>
            </div>
          </Section>
        )}
      </div>

      {/* Right Column */}
      <div className="md:col-span-2 space-y-6">
        <Section title="Skills" icon={Code}>
          {profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added yet.</p>
          )}
        </Section>

        <Section title="Experience" icon={Briefcase}>
          {profile.experience.length > 0 ? (
            <div className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-500 pl-4">
                  <h4 className="font-medium text-gray-900">{exp.position}</h4>
                  <p className="text-gray-600">{exp.company}</p>
                  {exp.startDate && (
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(exp.startDate).toLocaleDateString()} -{' '}
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString()
                        : 'Present'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No experience added yet.</p>
          )}
        </Section>

        <Section title="Education" icon={BookOpen}>
          {profile.education.length > 0 ? (
            <div className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.startDate && (
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(edu.startDate).toLocaleDateString()} -{' '}
                      {edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString()
                        : 'Present'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No education information added yet.</p>
          )}
        </Section>

        <Section title="Certifications" icon={Award}>
          {profile.certification.length > 0 ? (
            <div className="space-y-4">
              {profile.certification.map((cert, index) => (
                <div key={index} className="border-l-2 border-gray-300 pl-4">
                  <h4 className="font-medium text-gray-900">
                    {cert.certificate}
                  </h4>
                  <p className="text-gray-600">{cert.company}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No certifications added yet.</p>
          )}
        </Section>
      </div>
    </div>
  );
};

export default AboutView;
