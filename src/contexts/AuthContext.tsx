import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User as AuthUser, CreateCashierData, CreateAccountData, CashierLoginData } from '@/lib/auth-service';

export type UserRole = 'admin' | 'cashier';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
  profilePicture?: string;
  isGoogleUser: boolean;
  idNumber?: string; // For cashier accounts
  createdBy?: string; // ID of the admin who created this user (for cashiers)
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  // Google Authentication
  signInWithGoogle: () => Promise<void>;
  // Email/Password Authentication (for admins only)
  signInWithEmailPassword: (email: string, password: string) => Promise<void>;
  // ID Number/Password Authentication (for cashiers only)
  signInWithIdNumber: (data: CashierLoginData) => Promise<void>;
  // Account Creation
  createAccount: (data: CreateAccountData) => Promise<User>;
  // Admin functions
  createCashierAccount: (data: CreateCashierData) => Promise<User>;
  getAllCashiers: () => Promise<User[]>;
  deleteCashierAccount: (cashierId: string) => Promise<void>;
  // ID number validation function
  idNumberExistsForAdmin: (idNumber: string) => Promise<boolean>;
  // User functions
  changePassword: (newPassword: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      const user = await authService.signInWithGoogle();
      setUser(user);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailPassword = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const user = await authService.signInWithEmailPassword(email, password);
      setUser(user);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithIdNumber = async (data: CashierLoginData): Promise<void> => {
    try {
      setLoading(true);
      const user = await authService.signInWithIdNumber(data);
      setUser(user);
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (data: CreateAccountData): Promise<User> => {
    try {
      setLoading(true);
      const newUser = await authService.createAccount(data);
      setUser(newUser);
      return newUser;
    } catch (error) {
      setLoading(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCashierAccount = async (data: CreateCashierData): Promise<User> => {
    if (user?.role !== 'admin') {
      throw new Error('Only administrators can create cashier accounts');
    }
    
    try {
      const newCashier = await authService.createCashierAccount(data);
      
      // After creating a cashier, the admin will be signed out due to Firebase's behavior
      // We need to handle this gracefully by not updating the user state immediately
      // The auth state change listener will handle the sign-out automatically
      
      // Store information about the admin session for potential recovery
      const adminInfo = {
        uid: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isGoogleUser: user.isGoogleUser
      };
      
      // Store admin info in sessionStorage for potential recovery
      sessionStorage.setItem('lastAdminSession', JSON.stringify(adminInfo));
      
      return newCashier;
    } catch (error) {
      // If there's an error, we should still maintain the admin's session
      throw error;
    }
  };

  const getAllCashiers = async (): Promise<User[]> => {
    if (user?.role !== 'admin') {
      throw new Error('Only administrators can view cashier accounts');
    }
    return await authService.getAllCashiers();
  };

  const changePassword = async (newPassword: string): Promise<void> => {
    if (!user || user.isGoogleUser) {
      throw new Error('Password change not available for Google users');
    }
    await authService.changePassword(newPassword);
  };

  const sendPasswordReset = async (email: string): Promise<void> => {
    await authService.sendPasswordReset(email);
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Force logout even if Firebase signOut fails
      setUser(null);
    }
  };

  const idNumberExistsForAdmin = async (idNumber: string): Promise<boolean> => {
    if (user?.role !== 'admin') {
      throw new Error('Only administrators can validate ID numbers');
    }
    return await authService.idNumberExistsForAdmin(idNumber, user.id);
  };

  const deleteCashierAccount = async (cashierId: string): Promise<void> => {
    if (user?.role !== 'admin') {
      throw new Error('Only administrators can delete cashier accounts');
    }
    await authService.deleteCashierAccount(cashierId);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    signInWithGoogle,
    signInWithEmailPassword,
    signInWithIdNumber,
    createAccount,
    createCashierAccount,
    getAllCashiers,
    deleteCashierAccount,
    idNumberExistsForAdmin,
    changePassword,
    sendPasswordReset,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 