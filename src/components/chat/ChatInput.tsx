import { Send, Paperclip, Image, Video } from 'lucide-react';
import { useRef, useState } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  onFileSelect?: (file: File, type: 'photo' | 'video') => void;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onFileSelect,
}: ChatInputProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [showFileMenu, setShowFileMenu] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter, but Shift+Enter creates a new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form && value.trim() && !disabled) {
        onSubmit({ preventDefault: () => {} } as React.FormEvent);
      }
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file, 'photo');
      setShowFileMenu(false);
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file, 'video');
      setShowFileMenu(false);
    }
  };

  return (
    <footer className="p-4 md:px-6 bg-white border-t border-gray-200 shrink-0">
      <form className="flex items-end gap-2 mx-auto" onSubmit={onSubmit}>
        {/* File attachment button with dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFileMenu(!showFileMenu)}
            disabled={disabled}
            className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          {/* Dropdown menu */}
          {showFileMenu && (
            <div className="absolute bottom-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 transition-colors text-left"
              >
                <Image
                  size={18}
                  className="text-blue-600"
                  aria-label="Photo icon"
                />
                <span className="text-sm font-medium text-gray-700">Photo</span>
              </button>
              <div className="border-t border-gray-100" />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 transition-colors text-left"
              >
                <Video size={18} className="text-red-600" />
                <span className="text-sm font-medium text-gray-700">Video</span>
              </button>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
            disabled={disabled}
          />
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelect}
            className="hidden"
            disabled={disabled}
          />
        </div>

        <div className="flex-1 bg-gray-100 rounded-2xl flex items-center p-1 border border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Shift+Enter for new line)"
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none resize-none max-h-32 min-h-[40px] custom-scrollbar"
            rows={1}
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </footer>
  );
}
