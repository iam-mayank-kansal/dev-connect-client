"use client";
import React from "react";
import { Toaster } from "react-hot-toast";
import { useUser } from "@/utils/context/user-context";
import ChangePassword from "@/components/settings/ChangePassword";
import AccountDeactivation from "@/components/settings/AccountDeactivation";

export default function SettingsPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Please log in to view settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 text-black">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
        <ChangePassword />
        <AccountDeactivation />
      </div>
    </div>
  );
}
    