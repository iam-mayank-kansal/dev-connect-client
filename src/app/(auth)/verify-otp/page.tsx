'use client';

import React, { Suspense } from 'react';
import VerifyOtpForm from '@/components/auth/VerifyOtpForm';
import { Toaster } from 'react-hot-toast';

function VerifyOtpContent() {
  return (
    <main className="flex  items-center justify-center bg-gradient-to-br">
      <Toaster position="top-center" />
      <VerifyOtpForm />
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
