'use client';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/useAuthStore';
import ChangePassword from '@/components/settings/ChangePassword';
import AccountDeactivation from '@/components/settings/AccountDeactivation';
import BlockedUsers from '@/components/settings/BlockedUsers';
import IgnoredUsers from '@/components/settings/IgnoredUsers';

export default function SettingsPage() {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Please log in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-black">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Account Settings
        </h1>

        <div className="space-y-8">
          {/* Security Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Security</h2>
            </div>
            <div className="p-6">
              <ChangePassword />
            </div>
          </div>

          {/* Blocked Users Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Blocked Users
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage users you have blocked. Unblocking will allow them to
                send you connection requests and messages.
              </p>
            </div>
            <div className="p-6">
              <BlockedUsers />
            </div>
          </div>

          {/* Ignored Users Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Ignored Users
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage users you have ignored. Unignoring will allow you to send
                them connection requests.
              </p>
            </div>
            <div className="p-6">
              <IgnoredUsers />
            </div>
          </div>

          {/* Account Management Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Account Management
              </h2>
            </div>
            <div className="p-6">
              <AccountDeactivation />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
