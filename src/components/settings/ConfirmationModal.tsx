'use client';
import React, { useState } from 'react';
import { AlertCircle, RotateCw, Eye, EyeOff } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: (password: string) => void;
  loading?: boolean;
}

export default function ConfirmationModal({
  title,
  description,
  onCancel,
  onConfirm,
  loading,
}: Props) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleConfirm = () => {
    onConfirm(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 mx-4">
        <div className="flex flex-col items-center justify-center mb-4">
          <AlertCircle size={48} className="text-red-500 mb-2" />
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {title}
          </h3>
        </div>
        <p className="text-sm text-gray-500 text-center mb-6">{description}</p>

        {/* Password input with show/hide toggle */}
        <div className="mb-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 pr-10" // Added pr-10 for icon space
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-blue-700 focus:outline-none"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1} // Prevents tabbing to this button for better accessibility flow
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline mt-2"
          >
            Forgot Password?
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !password}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition ${
              loading || !password
                ? 'bg-red-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            }`}
          >
            {loading ? (
              <RotateCw size={16} className="animate-spin" />
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
