'use client'; 
import { createContext, useContext, useState, useEffect, useMemo, useCallback, FC } from 'react';
import { UserContextType, UserProviderProps } from './user-context.type';
import { UserProfile } from '@/lib/types';
import { getUserProfile } from '@/lib/api';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const triggerRefresh = useCallback(() => {
        setRefreshTrigger(prev => prev + 1);
    }, []);

    const login = useCallback((userData: UserProfile) => {
        setUser(userData);
        triggerRefresh();
    }, [triggerRefresh]);

    const logout = useCallback(() => {
        setUser(null);
        triggerRefresh();
    }, [triggerRefresh]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setIsLoading(true);
            try {
                const response = await getUserProfile();
                setUser(response.data.data);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [refreshTrigger]);

    const value = useMemo(() => ({
        user,
        isLoading,
        login,
        logout,
        triggerRefresh,
    }), [user, isLoading, login, logout, triggerRefresh]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};