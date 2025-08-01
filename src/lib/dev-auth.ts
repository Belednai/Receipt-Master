// Development authentication fallback
// This allows testing the app without Firebase configuration

import { UserRole } from '@/contexts/AuthContext';

export interface DevUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
  profilePicture?: string;
  isGoogleUser: boolean;
}

class DevAuthService {
  private users: DevUser[] = [];
  private currentUser: DevUser | null = null;

  constructor() {
    // Initialize with a default admin user for development
    this.users = [
      {
        id: 'dev-admin-1',
        email: 'admin@receiptmaster.com',
        name: 'Development Admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        isGoogleUser: true
      }
    ];
  }

  async signInWithGoogle(): Promise<DevUser | null> {
    console.log('🔧 DEV MODE: Simulating Google sign-in with account selection...');
    
    // Simulate account selection delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // CRITICAL: In development mode, we simulate a real Google account with valid email
    const mockGoogleEmail = 'dev.admin@receiptmaster.com';
    
    console.log('🔧 DEV MODE: Simulating Google account with email:', mockGoogleEmail);

    // CRITICAL: Validate the mock email format (same as production)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mockGoogleEmail)) {
      throw new Error('DEV MODE: Invalid mock email format');
    }

    // Check if admin already exists
    const adminUser = this.users.find(u => u.role === 'admin' && u.email);
    if (adminUser) {
      console.log('🔧 DEV MODE: Signing in existing admin:', adminUser.email);
      this.currentUser = adminUser;
      return adminUser;
    }
    
    // Check if this would be the first user (admin)
    const hasAdmin = this.users.some(user => user.role === 'admin');
    const role = hasAdmin ? 'cashier' : 'admin';
    
    console.log('🔧 DEV MODE: Creating user with role:', role);
    
    // Create admin if none exists
    const newUser: DevUser = {
      id: `dev-${role}-${Date.now()}`,
      email: mockGoogleEmail,
      name: 'Development Admin',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isGoogleUser: true
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    console.log('🔧 DEV MODE: User created successfully:', {
      email: newUser.email,
      role: newUser.role,
      isGoogleUser: newUser.isGoogleUser
    });
    
    return newUser;
  }

  async signInWithEmailPassword(email: string, password: string): Promise<DevUser | null> {
    console.log('🔧 DEV MODE: Simulating email/password sign-in for:', email);
    
    // CRITICAL: Validate email format even in development mode
    if (!email || email.trim() === '') {
      console.error('❌ DEV MODE: Empty email provided');
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailRegex.test(email)) {
      console.error('❌ DEV MODE: Invalid email format:', email);
      throw new Error('Invalid email format');
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    // Simulate password validation
    if (!password || password.length < 6) {
      console.error('❌ DEV MODE: Invalid password');
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user exists
    const user = this.users.find(u => u.email === sanitizedEmail);
    if (user) {
      console.log('🔧 DEV MODE: Existing user found:', user.email, 'Role:', user.role);
      this.currentUser = user;
      return user;
    }

    console.log('🔧 DEV MODE: User not found, this would normally fail in production');
    throw new Error('Invalid email or password');
  }

  async createCashierAccount(data: { email: string; password: string; name: string }): Promise<DevUser> {
    console.log('🔧 DEV MODE: Creating cashier account for:', data.email);
    
    // CRITICAL: Validate all inputs even in development mode
    if (!data.email || data.email.trim() === '') {
      console.error('❌ DEV MODE: Empty email provided');
      throw new Error('Email is required');
    }

    if (!data.name || data.name.trim() === '') {
      console.error('❌ DEV MODE: Empty name provided');
      throw new Error('Name is required');
    }

    if (!data.password || data.password.length < 6) {
      console.error('❌ DEV MODE: Invalid password');
      throw new Error('Password must be at least 6 characters');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      console.error('❌ DEV MODE: Invalid email format:', data.email);
      throw new Error('Invalid email format');
    }

    const sanitizedEmail = data.email.trim().toLowerCase();
    
    // Check if user already exists
    if (this.users.find(u => u.email === sanitizedEmail)) {
      console.error('❌ DEV MODE: Email already exists:', sanitizedEmail);
      throw new Error('An account with this email already exists');
    }
    
    const newCashier: DevUser = {
      id: `dev-cashier-${Date.now()}`,
      email: sanitizedEmail,
      name: data.name.trim(),
      role: 'cashier',
      createdAt: new Date(),
      updatedAt: new Date(),
      isGoogleUser: false
    };
    
    this.users.push(newCashier);
    
    console.log('🔧 DEV MODE: Cashier created successfully:', {
      email: newCashier.email,
      name: newCashier.name,
      role: newCashier.role
    });
    
    return newCashier;
  }

  async getAllCashiers(): Promise<DevUser[]> {
    return this.users.filter(u => u.role === 'cashier');
  }

  async changePassword(newPassword: string): Promise<void> {
    // Simulate password change
    console.log('Password changed in development mode');
  }

  async sendPasswordReset(email: string): Promise<void> {
    // Simulate password reset
    console.log('Password reset email sent in development mode');
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  onAuthStateChanged(callback: (user: DevUser | null) => void): () => void {
    // Simulate auth state changes
    callback(this.currentUser);
    
    return () => {
      // Cleanup function
    };
  }
}

export const devAuthService = new DevAuthService(); 