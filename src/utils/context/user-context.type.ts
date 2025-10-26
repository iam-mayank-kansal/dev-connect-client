import { UserProfile } from '@/lib/types/user';
import { ReactNode } from 'react';

// This interface defines the shape of your context's value
export interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  triggerRefresh: () => void;
}

// Define the props for the provider component
export interface UserProviderProps {
  children: ReactNode;
}
