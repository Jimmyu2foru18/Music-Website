import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbGetCurrentUser, dbLogout } from '../services/db';

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on load
    const currentUser = dbGetCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const logout = () => {
    dbLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
