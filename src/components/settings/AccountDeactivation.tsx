'use client';
import React, { useState } from 'react';
import { XCircle, ChevronDown, RotateCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteUser } from '@/lib/api';
import { useUser } from '@/utils/context/user-context';
import { useRouter } from 'next/navigation';
import ConfirmationModal from './ConfirmationModal';

export default function AccountDeactivation() {
  const { logout } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteAccount = async (password: string) => {
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      await deleteUser(password);
      logout();
      toast.success('Account deleted successfully!');
      router.push('/');
    } catch {
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between cursor-pointer items-center text-2xl font-semibold text-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <XCircle size={24} className="text-red-600" /> Account Deactivation
        </span>
        <ChevronDown
          size={24}
          className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-gray-600 mb-4">
            This action is irreversible. Deactivating your account will
            permanently remove your profile and all associated data.
          </p>
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white transition ${
              loading
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            {loading ? (
              <RotateCw size={16} className="animate-spin mr-2" />
            ) : (
              <XCircle size={16} className="mr-2" />
            )}
            Deactivate Account
          </button>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          title="Confirm Deactivation"
          description="Are you sure you want to delete your account? This action is irreversible and will permanently remove your profile and all associated data."
          onCancel={() => setShowModal(false)}
          onConfirm={handleDeleteAccount}
          loading={loading}
        />
      )}
    </div>
  );
}
