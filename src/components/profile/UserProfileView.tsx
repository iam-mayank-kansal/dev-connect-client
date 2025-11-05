'use client';
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Download,
  Edit,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
} from 'lucide-react';
import SectionCard from './SectionCard';
import SectionHeader from './SectionHeader';
import { UserProfile } from '@/lib/types/user';
import { getImageUrl } from '@/utils/helper/getImageUrl.ts';
import ConnectionActions from './connectionActions';
import Image from 'next/image';
import Link from 'next/link';
import SocialIcon from '@/utils/helper/SocialIcons';

const UserProfileView = ({
  user,
  isOwner,
  onEditClick,
  connectionStatus, // --- ADDED ---
}: {
  user: UserProfile;
  isOwner: boolean;
  onEditClick: () => void;
  connectionStatus: string; // --- ADDED ---
}) => {
  const profileImageSrc = user.profilePicture
    ? getImageUrl(user.profilePicture, 'profilePicture')
    : '';

  const resumeFileName = user.resume
    ? typeof user.resume === 'string'
      ? user.resume.split('/').pop()
      : 'N/A'
    : 'N/A';

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* --- Page Header --- */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          {/* --- MODIFIED: Show actions or edit button --- */}
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

        <div className="space-y-6">
          {/* --- Header / Basic Info --- */}
          <SectionCard>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0 mx-auto md:mx-0">
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
              </div>
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h2>
                {user.designation && (
                  <p className="text-xl text-gray-600 mt-1">
                    {user.designation}
                  </p>
                )}
                {user.connections && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
                    <Users size={18} />
                    <Link
                      href="/connections"
                      className="hover:underline hover:text-blue-600"
                    >
                      <span className="font-medium text-sm">
                        {user.connections.connected.length} connection
                      </span>
                    </Link>
                  </div>
                )}
                {user.bio && (
                  <p className="text-gray-700 mt-4 text-base">{user.bio}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Mail size={20} className="text-gray-500" />
                  Contact Information
                </h3>
                <div className="space-y-2 pl-7">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail size={16} />
                    <a
                      href={`mailto:${user.email}`}
                      className="hover:text-blue-600 hover:underline"
                    >
                      {user.email}
                    </a>
                  </div>
                  {user.mobile && user.mobile.number && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={16} />
                      <span>
                        {user.mobile.countryCode} {user.mobile.number}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-gray-500" />
                  Location
                </h3>
                <div className="text-gray-600 pl-7 space-y-1">
                  {user?.location?.address && <p>{user?.location?.address}</p>}
                  {(user?.location?.city ||
                    user?.location?.state ||
                    user?.location?.country) && (
                    <p>
                      {user?.location?.city}
                      {user?.location?.city && user?.location?.state && ', '}
                      {user?.location?.state}
                      {(user?.location?.city || user?.location?.state) &&
                        user?.location?.country &&
                        ', '}
                      {user?.location?.country}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Globe size={20} className="text-gray-500" />
                Social Links
              </h3>
              <div className="flex gap-5 pl-7">
                {user?.socialLinks?.map(
                  (link, index) =>
                    link.url && (
                      <a
                        key={index}
                        href={link.url}
                        title={link.platform}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-transform hover:scale-110"
                      >
                        <SocialIcon platform={link.platform} />
                      </a>
                    )
                )}
              </div>
            </div>
          </SectionCard>

          {/* --- Skills --- */}
          <SectionCard>
            <SectionHeader
              icon={<Code size={24} className="text-blue-600" />}
              title="Skills"
            />
            {user?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No skills added yet.</p>
            )}
          </SectionCard>

          {/* --- Experience --- */}
          <SectionCard>
            <SectionHeader
              icon={<Briefcase size={24} className="text-blue-600" />}
              title="Experience"
            />
            {user?.experience?.length > 0 ? (
              <div className="space-y-5">
                {user.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {exp.position}
                    </h4>
                    <p className="text-gray-700">{exp.company}</p>
                    {exp.startDate && (
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}{' '}
                        -{' '}
                        {exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })
                          : 'Present'}
                      </p>
                    )}
                    {exp.description && (
                      <p className="text-gray-700 mt-2 text-sm">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No experience information added yet.
              </p>
            )}
          </SectionCard>

          {/* --- Education --- */}
          <SectionCard>
            <SectionHeader
              icon={<BookOpen size={24} className="text-blue-600" />}
              title="Education"
            />
            {user?.education?.length > 0 ? (
              <div className="space-y-5">
                {user.education.map((edu, index) => (
                  <div
                    key={index}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {edu.degree}
                    </h4>
                    <p className="text-gray-700">{edu.institution}</p>
                    {edu.startDate && (
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(edu.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}{' '}
                        -{' '}
                        {edu.endDate
                          ? new Date(edu.endDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })
                          : 'Present'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No education information added yet.
              </p>
            )}
          </SectionCard>

          {/* --- Certifications --- */}
          <SectionCard>
            <SectionHeader
              icon={<Award size={24} className="text-blue-600" />}
              title="Certifications"
            />
            {user?.certification?.length > 0 ? (
              <div className="space-y-5">
                {user.certification.map((cert, index) => (
                  <div
                    key={index}
                    className="py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {cert.certificate}
                    </h4>
                    <p className="text-gray-700">{cert.company}</p>
                    {cert.issuedBy && (
                      <p className="text-gray-500 text-sm mt-1">
                        Issued by: {cert.issuedBy}
                      </p>
                    )}
                    {cert.issueDate && (
                      <p className="text-gray-500 text-sm mt-1">
                        Issued on:{' '}
                        {new Date(cert.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No certifications added yet.</p>
            )}
          </SectionCard>

          {/* --- Resume --- */}
          <SectionCard>
            <SectionHeader
              icon={<FileText size={24} className="text-blue-600" />}
              title="Resume"
            />
            {user?.resume ? (
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-gray-500" />
                <span className="text-gray-700 font-medium">
                  {resumeFileName}
                </span>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/resume/${user.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  <Download size={16} />
                  Download
                </a>
              </div>
            ) : (
              <p className="text-gray-500">No resume uploaded yet.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
