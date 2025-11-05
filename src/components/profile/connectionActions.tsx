'use client';
import {
  AlertOctagon,
  Check,
  MessageCircle,
  MoreVertical,
  Slash,
  UserCheck, // <-- 1. IMPORTED NEW ICON
  UserPlus,
  UserX,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ConnectionActions = ({
  status,
  userId,
}: {
  status: string;
  userId: string;
}) => {
  console.log(
    'Connection Action Started for user:',
    userId,
    'with status:',
    status,
    '-----------------'
  );
  const [localStatus, setLocalStatus] = useState(status);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync local state if prop changes
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

  // --- API Handlers ---

  const handleConnect = async () => {
    console.log('Connecting to:', userId);
    // --- TODO: API CALL ---
    // await sendConnectionRequest(userId);
    setLocalStatus('requestSent');
  };

  const handleCancelRequest = async () => {
    console.log('Cancelling request to:', userId);
    // --- TODO: API CALL ---
    // await cancelConnectionRequest(userId);
    setLocalStatus('not_connected');
  };

  const handleAccept = async () => {
    console.log('Accepting request from:', userId);
    // --- TODO: API CALL ---
    // await acceptConnectionRequest(userId);
    setLocalStatus('connected');
  };

  const handleReject = async () => {
    console.log('Rejecting request from:', userId);
    // --- TODO: API CALL ---
    // await rejectConnectionRequest(userId);
    setLocalStatus('not_connected');
  };

  const handleRemove = async () => {
    console.log('Removing connection with:', userId);
    // --- TODO: API CALL ---
    // await removeConnection(userId);
    setLocalStatus('not_connected');
    setIsMenuOpen(false);
  };

  const handleBlock = async () => {
    console.log('Blocking user:', userId);
    // --- TODO: API CALL ---
    // await blockUser(userId);
    setLocalStatus('blocked');
    setIsMenuOpen(false);
  };

  const handleUnblock = async () => {
    console.log('Unblocking user:', userId);
    // --- TODO: API CALL ---
    // await unblockUser(userId);
    setLocalStatus('not_connected');
  };

  // 2. ADDED NEW HANDLER
  const handleUnignore = async () => {
    console.log('Unignoring user:', userId);
    // --- TODO: API CALL ---
    // await unignoreUser(userId);
    setLocalStatus('not_connected');
  };

  // --- Button Styles ---
  const primaryButton =
    'flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm';
  const secondaryButton =
    'flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors';
  const dangerButton =
    'flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm';

  // 3. UPDATED RENDER LOGIC
  const renderButtons = () => {
    switch (localStatus) {
      case 'not_connected':
        return (
          <button onClick={handleConnect} className={primaryButton}>
            <UserPlus size={18} />
            Connect
          </button>
        );
      case 'requestSent':
        return (
          <>
            <button className={`${secondaryButton} opacity-70`} disabled>
              Request Sent
            </button>
            <button onClick={handleCancelRequest} className={secondaryButton}>
              Cancel
            </button>
          </>
        );
      case 'requestReceived':
        return (
          <>
            <button onClick={handleAccept} className={primaryButton}>
              <Check size={18} />
              Accept
            </button>
            <button onClick={handleReject} className={secondaryButton}>
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
          <button onClick={handleUnblock} className={dangerButton}>
            <Slash size={18} />
            Unblock
          </button>
        );
      case 'ignored': // <-- CHANGED THIS BLOCK
        return (
          <button onClick={handleUnignore} className={secondaryButton}>
            <UserCheck size={18} />
            Unignore
          </button>
        );
      default:
        return null;
    }
  };

  const renderMenuOptions = () => {
    switch (localStatus) {
      case 'connected':
        return (
          <>
            <button
              onClick={handleRemove}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserX size={16} />
              Remove Connection
            </button>
            <button
              onClick={handleBlock}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <AlertOctagon size={16} />
              Block User
            </button>
          </>
        );
      case 'not_connected':
      case 'requestSent':
      case 'requestReceived':
      case 'ignored': // This case is still correct
        return (
          <button
            onClick={handleBlock}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <AlertOctagon size={16} />
            Block User
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-2 relative">
      {renderButtons()}
      {localStatus !== 'blocked' && (
        <div ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={secondaryButton}
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
