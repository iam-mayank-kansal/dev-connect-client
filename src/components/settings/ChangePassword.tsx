'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// UI & Icons
import { Lock, Save, RotateCw, ChevronDown } from 'lucide-react';

// Store & Validation
import { useAuthStore } from '@/store/useAuthStore';
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from '@/lib/validation/auth';
import { PasswordInput } from '../ui/PasswordInput';

export default function ChangePassword() {
  const router = useRouter();

  // Global State
  const { changePassword, logout, isChangingPassword } = useAuthStore();

  // Local State
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 1. Validate with Zod
    const result = changePasswordSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // 2. Call Store Action
    try {
      await changePassword(formData.oldPassword, formData.newPassword);

      // 3. Reset & Logout
      setFormData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setIsOpen(false);
      logout();
      router.push('/login');
    } catch (err) {
      // Error handling is managed by the store (toast)
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-200">
      {/* Header / Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex cursor-pointer justify-between items-center text-xl font-semibold text-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <Lock size={20} /> Change Password
        </span>
        <ChevronDown
          size={20}
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Form Content */}
      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 pt-4 border-t border-gray-100 space-y-5"
        >
          <PasswordInput
            id="oldPassword"
            name="oldPassword"
            label="Current Password"
            value={formData.oldPassword}
            onChange={handleChange}
            error={errors.oldPassword}
            placeholder="Enter current password"
          />

          <PasswordInput
            id="newPassword"
            name="newPassword"
            label="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="Enter new password"
            autoComplete="new-password"
          />

          <PasswordInput
            id="confirmNewPassword"
            name="confirmNewPassword"
            label="Confirm New Password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            error={errors.confirmNewPassword}
            placeholder="Confirm new password"
            autoComplete="new-password"
          />

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isChangingPassword}
              className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 cursor-pointer ${
                isChangingPassword
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isChangingPassword ? (
                <RotateCw size={18} className="animate-spin mr-2" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isChangingPassword ? 'Saving...' : 'Save New Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
