import Image from 'next/image';
import Link from 'next/link';
import { User, Users, Mail, Phone, MapPin, Globe } from 'lucide-react';
import SocialIcon from '@/utils/helper/SocialIcons'; // Adjust path
import SectionCard from '../../SectionCard';
import { User as UserEntity, SocialLink } from '@/lib/types/entities';

export default function ViewBasicInfo({ user }: { user: UserEntity }) {
  return (
    <SectionCard>
      {/* Top Section: Image, Name, Bio */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Profile Picture */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          {user.profilePicture ? (
            <Image
              src={user.profilePicture}
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

        {/* Details */}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          {user.designation && (
            <p className="text-xl text-gray-600 mt-1">{user.designation}</p>
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

      {/* Middle Section: Contact & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100">
        {/* Contact */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Mail size={20} className="text-gray-500" /> Contact Information
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
            {user.mobile?.number && (
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} />
                <span>
                  {user.mobile.countryCode} {user.mobile.number}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-gray-500" /> Location
          </h3>
          <div className="text-gray-600 pl-7 space-y-1">
            {user?.location?.address && <p>{user.location.address}</p>}
            {(user?.location?.city || user?.location?.country) && (
              <p>
                {[
                  user.location.city,
                  user.location.state,
                  user.location.country,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Socials */}
      <div className="mt-8 pt-8 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Globe size={20} className="text-gray-500" /> Social Links
        </h3>
        <div className="flex gap-5 pl-7">
          {user?.socialLinks?.map(
            (link: SocialLink, index: number) =>
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
  );
}
