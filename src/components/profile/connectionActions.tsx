'use client';

import { useConnection } from '@/hooks/useConnections';
import { useFindConnections } from '@/hooks/useFindConnections';
import {
  AlertOctagon,
  Check,
  MessageCircle,
  MoreVertical,
  Slash,
  UserCheck,
  UserPlus,
  UserX,
  X,
  EyeOff, // Added for the 'Ignore' menu option
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ConnectionActions = ({
  status,
  userId,
}: {
  status: string;
  userId: string;
}) => {
  // 1. Local State & Hooks
  const [localStatus, setLocalStatus] = useState(status);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    sendConnectionRequest,
    blockUser,
    unblockUser,
    ignoreUser,
    unignoreUser,
    unfriend,
    acceptConnection,
    rejectConnection,
    cancelSentRequest,
  } = useConnection(true);

  const { removeUserFromList } = useFindConnections();

  // 2. Effects
  // Sync local state if prop changes (e.g., after a refetch)
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  // Handle outside click to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // 3. API Handlers
  const handleConnect = async (id: string) => {
    await sendConnectionRequest(id);
    setLocalStatus('requestSent');
    removeUserFromList(id); // Optional: Remove from 'Find' list if applicable
  };

  const handleCancelRequest = async (id: string) => {
    await cancelSentRequest(id);
    setLocalStatus('not_connected');
  };

  const handleAccept = async (id: string) => {
    await acceptConnection(id);
    setLocalStatus('connected');
  };

  const handleReject = async (id: string) => {
    await rejectConnection(id);
    setLocalStatus('not_connected');
  };

  const handleRemove = async (id: string) => {
    await unfriend(id);
    setLocalStatus('not_connected');
    setIsMenuOpen(false);
  };

  const handleBlock = async (id: string) => {
    await blockUser(id);
    setLocalStatus('blocked');
    setIsMenuOpen(false);
  };

  const handleUnblock = async (id: string) => {
    await unblockUser(id);
    setLocalStatus('not_connected');
  };

  const handleUnignore = async (id: string) => {
    await unignoreUser(id);
    setLocalStatus('not_connected');
  };

  // Fixed: This function was previously unclosed
  const handleIgnore = async (id: string) => {
    await ignoreUser(id);
    setLocalStatus('ignored');
    setIsMenuOpen(false);
    removeUserFromList(id);
  };

  // 4. Styles (Moved outside of functions to avoid recreation)
  const primaryButton =
    'flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed';
  const secondaryButton =
    'flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors';
  const dangerButton =
    'flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm';

  // 5. Render Logic
  const renderButtons = () => {
    switch (localStatus) {
      case 'not_connected':
        return (
          <button
            onClick={() => handleConnect(userId)}
            className={primaryButton}
          >
            <UserPlus size={18} />
            Connect
          </button>
        );
      case 'requestSent':
        return (
          <>
            <button className={secondaryButton} disabled>
              Request Sent
            </button>
            <button
              onClick={() => handleCancelRequest(userId)}
              className={secondaryButton}
            >
              Cancel
            </button>
          </>
        );
      case 'requestReceived':
        return (
          <>
            <button
              onClick={() => handleAccept(userId)}
              className={primaryButton}
            >
              <Check size={18} />
              Accept
            </button>
            <button
              onClick={() => handleReject(userId)}
              className={secondaryButton}
            >
              <X size={18} />
              Reject
            </button>
          </>
        );
      case 'connected':
        return (
          <button className={primaryButton}>
            <MessageCircle size={18} />
            Message
          </button>
        );
      case 'blocked':
        return (
          <button
            onClick={() => handleUnblock(userId)}
            className={dangerButton}
          >
            <Slash size={18} />
            Unblock
          </button>
        );
      case 'ignored':
        return (
          <button
            onClick={() => handleUnignore(userId)}
            className={secondaryButton}
          >
            <UserCheck size={18} />
            Unignore
          </button>
        );
      default:
        return null;
    }
  };

  const renderMenuOptions = () => {
    // Common Block Option
    const blockOption = (
      <button
        onClick={() => handleBlock(userId)}
        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
      >
        <AlertOctagon size={16} />
        Block User
      </button>
    );

    switch (localStatus) {
      case 'connected':
        return (
          <>
            <button
              onClick={() => handleRemove(userId)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserX size={16} />
              Remove Connection
            </button>
            {blockOption}
          </>
        );
      case 'not_connected':
      case 'requestReceived':
        return (
          <>
            <button
              onClick={() => handleIgnore(userId)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <EyeOff size={16} />
              Ignore
            </button>
            {blockOption}
          </>
        );
      case 'requestSent':
      case 'ignored':
        return blockOption;
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2 relative items-center">
      {renderButtons()}

      {/* Menu Trigger (Hide if blocked, as unblock is the only action) */}
      {localStatus !== 'blocked' && (
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`${secondaryButton} px-3`}
          >
            <MoreVertical size={18} />
          </button>

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 border border-gray-200 overflow-hidden py-1">
              {renderMenuOptions()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionActions;
