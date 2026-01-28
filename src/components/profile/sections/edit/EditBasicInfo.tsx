import Image from 'next/image';
import { Edit, Trash2, Upload, X, Camera, Eye } from 'lucide-react'; // Added Eye icon
import { useState, useRef, useEffect } from 'react';
import SectionCard from '../../SectionCard';

interface EditBasicInfoProps {
  name: string;
  designation: string;
  bio: string;
  currentImage: string | null;
  onUpdate: (field: string, value: unknown) => void;
  onFileChange: (file: File | null) => void;
}

export default function EditBasicInfo({
  name,
  designation,
  bio,
  currentImage,
  onUpdate,
  onFileChange,
}: EditBasicInfoProps) {
  const [preview, setPreview] = useState(currentImage);
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      onFileChange(file); // Send file to parent
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onFileChange(null);
    onUpdate('profilePicture', '');
    onUpdate('profilePictureId', '');
    setShowMenu(false);
  };

  // New function to view photo
  const handleViewPhoto = () => {
    if (preview) {
      window.open(preview, '_blank');
      setShowMenu(false);
    }
  };

  const inputStyle =
    'block border w-full p-2.5 text-sm rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  return (
    <SectionCard>
      <div className="flex flex-col md:flex-row gap-8">
        {/* --- Profile Picture Section --- */}
        <div className="relative mx-auto md:mx-0 group h-36 w-36">
          <div className="relative w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
            {preview ? (
              <Image
                src={preview}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Camera size={48} />
              </div>
            )}
          </div>

          {/* Edit Button Overlay */}
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 shadow-lg transition-transform active:scale-95 z-10"
          >
            {showMenu ? <X size={16} /> : <Edit size={16} />}
          </button>

          {/* --- The UI Popup Menu --- */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden"
            >
              {/* View Photo Option */}
              {preview && (
                <button
                  type="button"
                  onClick={handleViewPhoto}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <Eye size={16} className="text-gray-500" />
                  View Photo
                </button>
              )}

              {/* Upload Photo Option */}
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors border-t border-gray-100"
              >
                <Upload size={16} className="text-blue-600" />
                Upload Photo
              </button>

              {/* Remove Photo Option */}
              {preview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-gray-100"
                >
                  <Trash2 size={16} />
                  Remove Photo
                </button>
              )}
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* --- Text Fields --- */}
        <div className="flex-grow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => onUpdate('name', e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Designation
              </label>
              <input
                value={designation}
                onChange={(e) => onUpdate('designation', e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => onUpdate('bio', e.target.value)}
              rows={4}
              className={inputStyle}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
