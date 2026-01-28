import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  return (
    <footer className="p-4 md:px-6 bg-white border-t border-gray-200 shrink-0">
      <form className="flex items-end gap-2 mx-auto" onSubmit={onSubmit}>
        <div className="flex-1 bg-gray-100 rounded-2xl flex items-center p-1 border border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-200 transition-all">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type a message..."
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
