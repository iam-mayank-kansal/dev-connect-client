'use client';

import React, { Suspense } from 'react';
import SetNewPasswordForm from '@/components/auth/SetNewPasswordForm';
import { Toaster } from 'react-hot-toast';

function SetNewPasswordContent() {
  return (
    <main className="flex  items-center justify-center bg-gradient-to-br">
      <Toaster position="top-center" />
      <SetNewPasswordForm />
    </main>
  );
}

export default function SetNewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <SetNewPasswordContent />
    </Suspense>
  );
}
