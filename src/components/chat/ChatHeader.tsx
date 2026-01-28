import Link from 'next/link';
import { ArrowLeft, Phone, Video, MoreVertical, User } from 'lucide-react';
import Image from 'next/image';
import { User as ChatUser } from '@/lib/types/chat';

export default function ChatHeader({ user }: { user: ChatUser }) {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0 z-10">
      <div className="flex items-center gap-3">
        <Link
          href="/chat"
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </Link>

        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            alt="Profile"
            width={128}
            height={128}
            className="w-10 h-10 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-10 p-1 h-10 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md">
            <User size={64} className="text-gray-400" />
          </div>
        )}
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">{user.name}</h2>
          <p className="text-xs text-green-600 font-medium">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-gray-500">
        <button className="p-2 hover:bg-gray-100 rounded-lg opacity-50 cursor-not-allowed">
          <Phone size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg opacity-50 cursor-not-allowed">
          <Video size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}
