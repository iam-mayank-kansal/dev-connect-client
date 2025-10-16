'use client';
import React, { useState } from 'react';
import { z, ZodError } from 'zod';
import {
  Lock,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  RotateCw,
  ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { resetUserPassword } from '@/lib/api';
import { useUser } from '@/utils/context/user-context';
import { useRouter } from 'next/navigation';

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

export default function ChangePassword() {
  const { logout } = useUser();
  const [open, setOpen] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState<ZodError | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors) setErrors(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      passwordSchema.parse(passwordData);
      setLoading(true);

      await resetUserPassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );

      toast.success('Password updated successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        showOldPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });

      // Corrected order: Log out first, then redirect
      logout();
      router.push('/login');
    } catch (err) {
      if (err instanceof ZodError) {
        setErrors(err);
        toast.error('Validation failed. Please check your passwords.');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (field: string) => {
    const issue = errors?.issues?.find((e) => e.path.includes(field));
    return issue ? issue.message : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-4 border border-gray-200">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex cursor-pointer justify-between items-center text-2xl font-semibold text-gray-800 focus:outline-none"
      >
        <span className="flex items-center gap-2">
          <Lock size={24} /> Change Password
        </span>
        <ChevronDown
          size={24}
          className={`transform transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 pt-4 border-t border-gray-200 space-y-4"
        >
          {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === 'oldPassword'
                  ? 'Current Password'
                  : field === 'newPassword'
                    ? 'New Password'
                    : 'Confirm New Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={
                    passwordData[
                      `show${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof PasswordData
                    ]
                      ? 'text'
                      : 'password'
                  }
                  name={field}
                  value={passwordData[field as keyof PasswordData] as string}
                  onChange={handlePasswordChange}
                  className={`w-full border ${
                    getErrorMessage(field)
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                  onClick={() =>
                    setPasswordData((prev) => ({
                      ...prev,
                      [`show${field.charAt(0).toUpperCase() + field.slice(1)}`]:
                        !(prev[
                          `show${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof PasswordData
                        ] as boolean),
                    }))
                  }
                >
                  {passwordData[
                    `show${field.charAt(0).toUpperCase() + field.slice(1)}` as keyof PasswordData
                  ] ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {getErrorMessage(field) && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />{' '}
                  {getErrorMessage(field)}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-white transition ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <RotateCw size={16} className="animate-spin mr-2" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              Save New Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
