import { SignupForm } from '@/components/auth/SignupForm';
import { Toaster } from 'react-hot-toast';

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br">
      <Toaster position="top-center" />
      <SignupForm />
    </main>
  );
}
