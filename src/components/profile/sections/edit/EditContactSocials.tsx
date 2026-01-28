'use client';

import { Mail, Globe, Plus, Trash2 } from 'lucide-react';
import SectionCard from '../../SectionCard';
import SectionHeader from '../../SectionHeader';
import { ILocation, IMobile, SocialLink } from '@/lib/types/entities';

// Common Country Codes
const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+1', flag: '🇺🇸', country: 'USA' },
  { code: '+44', flag: '🇬🇧', country: 'UK' },
  { code: '+1', flag: '🇨🇦', country: 'Canada' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+86', flag: '🇨🇳', country: 'China' },
  { code: '+971', flag: '🇦🇪', country: 'UAE' },
];

// Strictly defined platforms (Removed 'Other')
const SOCIAL_PLATFORMS = [
  'GitHub',
  'LinkedIn',
  'Twitter',
  'Instagram',
  'Facebook',
  'Website',
  'Portfolio',
];

interface EditContactSocialsProps {
  mobile: IMobile;
  location: ILocation;
  socialLinks: SocialLink[];
  onUpdateMobile: (value: IMobile) => void;
  onUpdateLocation: (value: ILocation) => void;
  onUpdateSocials: (links: SocialLink[]) => void;
}

export default function EditContactSocials({
  mobile,
  location,
  socialLinks,
  onUpdateMobile,
  onUpdateLocation,
  onUpdateSocials,
}: EditContactSocialsProps) {
  const baseInputStyle =
    'block border p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const fullWidthInputStyle = `${baseInputStyle} w-full`;

  const handleSocialChange = (index: number, field: string, value: string) => {
    const updated = [...(socialLinks || [])];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateSocials(updated);
  };

  const addSocial = () =>
    onUpdateSocials([...(socialLinks || []), { platform: 'GitHub', url: '' }]);

  const removeSocial = (index: number) => {
    const updated = [...(socialLinks || [])];
    updated.splice(index, 1);
    onUpdateSocials(updated);
  };

  return (
    <SectionCard>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Contact Side --- */}
        <div className="space-y-4">
          <SectionHeader icon={<Mail size={20} />} title="Contact" />

          <div className="flex gap-2">
            <div className="relative w-28">
              <select
                value={mobile?.countryCode || '+91'}
                onChange={(e) =>
                  onUpdateMobile({ ...mobile, countryCode: e.target.value })
                }
                className={`${baseInputStyle} w-full appearance-none pr-6 bg-white`}
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={item.country + item.code} value={item.code}>
                    {item.flag} {item.code}
                  </option>
                ))}
              </select>
            </div>

            <input
              placeholder="Phone Number"
              value={mobile?.number || ''}
              onChange={(e) =>
                onUpdateMobile({ ...mobile, number: e.target.value })
              }
              className={`${baseInputStyle} flex-1`}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              placeholder="Address"
              value={location?.address || ''}
              onChange={(e) =>
                onUpdateLocation({ ...location, address: e.target.value })
              }
              className={`${fullWidthInputStyle} mb-2`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="City"
                value={location?.city || ''}
                onChange={(e) =>
                  onUpdateLocation({ ...location, city: e.target.value })
                }
                className={fullWidthInputStyle}
              />
              <input
                placeholder="State"
                value={location?.state || ''}
                onChange={(e) =>
                  onUpdateLocation({ ...location, state: e.target.value })
                }
                className={fullWidthInputStyle}
              />
              <input
                placeholder="Country"
                value={location?.country || ''}
                onChange={(e) =>
                  onUpdateLocation({ ...location, country: e.target.value })
                }
                className={fullWidthInputStyle}
              />
            </div>
          </div>
        </div>

        {/* --- Socials Side --- */}
        <div className="space-y-4">
          <SectionHeader icon={<Globe size={20} />} title="Social Links" />
          <div className="space-y-3">
            {socialLinks?.map((link, index) => (
              <div key={index} className="flex gap-2 items-center">
                {/* Simplified Platform Selection */}
                <div className="w-1/3 min-w-[120px]">
                  <select
                    value={link.platform}
                    onChange={(e) =>
                      handleSocialChange(index, 'platform', e.target.value)
                    }
                    className={fullWidthInputStyle}
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* URL Input */}
                <input
                  placeholder="https://..."
                  value={link.url}
                  onChange={(e) =>
                    handleSocialChange(index, 'url', e.target.value)
                  }
                  className={`${baseInputStyle} flex-1`}
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeSocial(index)}
                  className="text-red-500 hover:text-red-700 p-2.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addSocial}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              <Plus size={16} /> Add Social Link
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
