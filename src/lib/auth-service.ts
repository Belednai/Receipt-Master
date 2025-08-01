import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { UserRole } from '@/contexts/AuthContext';

export interface User {
  id: string;
  email: string; // For admins: actual email, for cashiers: internal email (hidden)
  name: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
  profilePicture?: string;
  isGoogleUser: boolean;
  idNumber?: string; // For cashier accounts (primary identifier)
  createdBy?: string; // ID of the admin who created this user (for cashiers)
}

export interface CreateCashierData {
  idNumber: string; // Complete ID number (e.g., "SSD-001", "BSC-002")
  password: string;
  name: string;
}

export interface CreateAccountData {
  email: string;
  password: string;
  name: string;
}

export interface CashierLoginData {
  idNumber: string;
  password: string;
}

class AuthService {
  private googleProvider: GoogleAuthProvider;
  private useDevMode: boolean;

  constructor() {
    this.googleProvider = new GoogleAuthProvider();
    // Always prompt for account selection - CRITICAL for security
    this.googleProvider.setCustomParameters({ prompt: 'select_account' });
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');
    
    // FORCE FIREBASE AUTHENTICATION - NO MOCK DATA
    this.useDevMode = false; // Always use Firebase authentication
    
    console.log('🔐 FIREBASE MODE ACTIVE: Using real Google authentication');
    console.log('🚨 Google account selection will be enforced');
    console.log('📝 Ensure Google Sign-In is enabled in Firebase Console');
    console.log('🎯 Click "Continue with Google" to see account selection popup');
  }

  // Check if any admin exists in the system
  async hasAdminUser(): Promise<boolean> {
    try {
      const adminQuery = query(
        collection(db, 'users'), 
        where('role', '==', 'admin')
      );
      const adminSnapshot = await getDocs(adminQuery);
      return !adminSnapshot.empty;
    } catch (error) {
      console.error('Error checking for admin user:', error);
      return false;
    }
  }

  // Check if email already exists in the system
  async emailExists(email: string): Promise<boolean> {
    try {
      const emailQuery = query(
        collection(db, 'users'), 
        where('email', '==', email.toLowerCase())
      );
      const emailSnapshot = await getDocs(emailQuery);
      return !emailSnapshot.empty;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }

  // Check if ID number already exists globally (for admin accounts)
  async idNumberExists(idNumber: string): Promise<boolean> {
    try {
      const idQuery = query(
        collection(db, 'users'), 
        where('idNumber', '==', idNumber)
      );
      const idSnapshot = await getDocs(idQuery);
      return !idSnapshot.empty;
    } catch (error) {
      console.error('Error checking if ID number exists:', error);
      return false;
    }
  }

  // Check if ID number already exists for a specific admin (for cashier accounts)
  async idNumberExistsForAdmin(idNumber: string, adminId: string): Promise<boolean> {
    try {
      const idQuery = query(
        collection(db, 'users'), 
        where('idNumber', '==', idNumber),
        where('createdBy', '==', adminId),
        where('role', '==', 'cashier')
      );
      const idSnapshot = await getDocs(idQuery);
      return !idSnapshot.empty;
    } catch (error) {
      console.error('Error checking if ID number exists for admin:', error);
      return false;
    }
  }

  // Google Sign-In
  async signInWithGoogle(): Promise<User | null> {
    console.log('🔐 Starting REAL Google sign-in with account selection popup...');
    console.log('📱 You should see a Google account selection window');
    
    try {
      const result = await signInWithPopup(auth, this.googleProvider);
      const firebaseUser = result.user;

      console.log('📧 Google sign-in result:', {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        emailVerified: firebaseUser.emailVerified
      });

      // CRITICAL SECURITY CHECK: Validate that user has an email
      if (!firebaseUser.email || firebaseUser.email.trim() === '') {
        console.error('❌ SECURITY VIOLATION: User attempted to sign in without email');
        await signOut(auth); // Force sign out immediately
        throw new Error('A valid email address is required to use this application. Please sign in with a Google account that has an email address.');
      }

      // CRITICAL SECURITY CHECK: Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(firebaseUser.email)) {
        console.error('❌ SECURITY VIOLATION: Invalid email format:', firebaseUser.email);
        await signOut(auth); // Force sign out immediately
        throw new Error('Invalid email address format. Please try again with a valid Google account.');
      }

      // CRITICAL SECURITY CHECK: Ensure email is not empty after trim
      const sanitizedEmail = firebaseUser.email.trim().toLowerCase();
      if (sanitizedEmail.length === 0) {
        console.error('❌ SECURITY VIOLATION: Empty email after sanitization');
        await signOut(auth);
        throw new Error('Email address cannot be empty. Please use a valid Google account.');
      }

      console.log('✅ Email validation passed for:', sanitizedEmail);
      
      // Check if user already exists in our database
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const existingUser = userDoc.data() as User;
        console.log('👤 Existing user found:', existingUser.email, 'Role:', existingUser.role);
        
        // CRITICAL SECURITY CHECK: Validate existing user still has valid email
        if (!existingUser.email || existingUser.email !== sanitizedEmail) {
          console.error('❌ SECURITY VIOLATION: Existing user email mismatch or missing');
          await signOut(auth);
          throw new Error('Account security validation failed. Please contact support.');
        }
        
        // User exists, return existing user data
        return existingUser;
      } else {
        // ALL Google sign-ins create admin accounts
        const role: UserRole = 'admin';
        
        console.log('🔍 Google user creation check:', {
          willBeRole: role,
          email: sanitizedEmail
        });

        // CRITICAL: Log admin creation for security monitoring
        console.log('👑 CREATING ADMIN USER (Google):', sanitizedEmail);
        
        // Create new user document with validated email
        const newUser: User = {
          id: firebaseUser.uid,
          email: sanitizedEmail,
          name: firebaseUser.displayName || sanitizedEmail.split('@')[0],
          role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          profilePicture: firebaseUser.photoURL || undefined,
          isGoogleUser: true
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        
        console.log('✅ Admin user created successfully:', {
          email: newUser.email,
          role: newUser.role,
          isGoogleUser: newUser.isGoogleUser
        });
        
        return newUser;
      }
    } catch (error) {
      console.error('❌ Error signing in with Google:', error);
      
      // CRITICAL: Ensure user is signed out on ANY error to prevent unauthorized access
      try {
        await signOut(auth);
        console.log('🔐 User forcibly signed out due to error');
      } catch (signOutError) {
        console.error('❌ Error signing out after failed login:', signOutError);
      }
      
      // Handle Firebase errors - NO FALLBACK TO MOCK DATA
      if (error instanceof Error) {
        if (error.message.includes('CONFIGURATION_NOT_FOUND') || error.message.includes('configuration-not-found')) {
          console.error('🔥 FIREBASE CONFIGURATION ERROR');
          console.error('📝 REQUIRED: Enable Google Sign-In in Firebase Console');
          console.error('🔗 Go to: https://console.firebase.google.com');
          console.error('⚙️  Authentication → Sign-in method → Google → Enable');
          throw new Error('Google Sign-In is not enabled in Firebase Console. Please enable it first.');
        } else if (error.message.includes('popup_closed_by_user')) {
          throw new Error('Google sign-in was cancelled. Please try again.');
        } else if (error.message.includes('network')) {
          throw new Error('Network error. Please check your internet connection.');
        } else if (error.message.includes('email') || error.message.includes('SECURITY')) {
          // Re-throw security-related errors as-is
          throw error;
        }
      }
      
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  }

  // Email/Password Sign-In (for admins only)
  async signInWithEmailPassword(email: string, password: string): Promise<User | null> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        const user = userDoc.data() as User;
        // Only allow admins to sign in with email/password
        if (user.role !== 'admin') {
          await signOut(auth);
          throw new Error('Only admin accounts can sign in with email/password');
        }
        return user;
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error signing in with email/password:', error);
      throw new Error('Invalid email or password');
    }
  }

  // ID Number/Password Sign-In (for cashiers only)
  async signInWithIdNumber(data: CashierLoginData): Promise<User | null> {
    try {
      // Find user by ID number
      const idQuery = query(
        collection(db, 'users'), 
        where('idNumber', '==', data.idNumber),
        where('role', '==', 'cashier')
      );
      const idSnapshot = await getDocs(idQuery);
      
      if (idSnapshot.empty) {
        throw new Error('Invalid ID number or password');
      }
      
      const userDoc = idSnapshot.docs[0];
      const user = userDoc.data() as User;
      
      // For cashiers, we need to sign in with their email (stored internally)
      // but they login with ID number
      if (!user.email) {
        throw new Error('Cashier account is missing email');
      }
      
      // Sign in with the stored email and provided password
      const result = await signInWithEmailAndPassword(auth, user.email, data.password);
      
      // Verify it's the same user
      if (result.user.uid !== userDoc.id) {
        await signOut(auth);
        throw new Error('Authentication failed');
      }
      
      return user;
    } catch (error) {
      console.error('Error signing in with ID number:', error);
      if (error instanceof Error && error.message.includes('Only admin accounts')) {
        throw error;
      }
      throw new Error('Invalid ID number or password');
    }
  }

  // Create Manual Account (Non-Google users) - Only creates admin accounts
  async createAccount(data: CreateAccountData): Promise<User> {
    try {
      // Check if email already exists globally (admin emails must be unique)
      const emailExists = await this.emailExists(data.email);
      if (emailExists) {
        throw new Error('An account with this email already exists');
      }
      
      // Create Firebase Auth user
      const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      // Check if this should be the admin (first user)
      const shouldBeAdmin = !(await this.hasAdminUser());
      const role: UserRole = shouldBeAdmin ? 'admin' : 'admin'; // Always create admin accounts
      
      console.log('🔍 Manual account creation check:', {
        isFirstUser: shouldBeAdmin,
        willBeRole: role,
        email: data.email
      });

      // CRITICAL: Log admin creation for security monitoring
      if (shouldBeAdmin) {
        console.log('👑 CREATING FIRST ADMIN USER (Manual):', data.email);
      } else {
        console.log('👑 CREATING ADDITIONAL ADMIN USER (Manual):', data.email);
      }
      
      // Create user document in Firestore
      const newUser: User = {
        id: result.user.uid,
        email: data.email,
        name: data.name,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isGoogleUser: false
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUser);
      
      return newUser;
    } catch (error) {
      console.error('Error creating account:', error);
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          throw new Error('An account with this email already exists');
        } else if (error.message.includes('weak-password')) {
          throw new Error('Password is too weak. Please use at least 6 characters');
        } else if (error.message.includes('invalid-email')) {
          throw new Error('Invalid email address');
        } else {
          throw new Error(`Failed to create account: ${error.message}`);
        }
      }
      throw new Error('Failed to create account');
    }
  }

  // Create Cashier Account (Admin only) - Uses complete ID number
  async createCashierAccount(data: CreateCashierData): Promise<User> {
    try {
      // Get the current admin user ID
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No admin user is currently signed in');
      }
      
      // Validate ID number format (letters, numbers, and dash)
      const idNumberRegex = /^[A-Za-z0-9]+-[0-9]+$/;
      if (!idNumberRegex.test(data.idNumber)) {
        throw new Error('ID number must be in format: LETTERS/NUMBERS-NUMBERS (e.g., "SSD-001", "BSC-002")');
      }
      
      // Check if ID number already exists for this specific admin
      const idNumberExists = await this.idNumberExistsForAdmin(data.idNumber, currentUser.uid);
      if (idNumberExists) {
        throw new Error(`You have already created a cashier with the ID number "${data.idNumber}". Please use a different ID number.`);
      }
      
      // Generate a unique email for the cashier (internal use only)
      // This is required by Firebase Auth but hidden from the admin
      const internalEmail = `cashier.${currentUser.uid}.${data.idNumber}@receiptmaster.internal`;
      
      // Check if Firebase Auth user with this email already exists (from previous deletion)
      // We'll try to create the user, and if it fails with email-already-in-use,
      // we'll handle it by creating a new unique email
      let finalInternalEmail = internalEmail;
      let attempt = 1;
      
      while (attempt <= 3) { // Try up to 3 times with different emails
        try {
          // Store admin session info before creating cashier
          const adminSessionInfo = {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'Admin',
            isGoogleUser: currentUser.providerData.some(provider => provider.providerId === 'google.com')
          };
          
          // Create Firebase Auth user with internal email
          // Note: This will automatically sign in as the new user, which will sign out the admin
          const result = await createUserWithEmailAndPassword(auth, finalInternalEmail, data.password);
          
          // Create user document in Firestore
          const newUser: User = {
            id: result.user.uid,
            email: finalInternalEmail, // Internal email for Firebase Auth (hidden from admin)
            name: data.name,
            idNumber: data.idNumber, // Admin-provided ID number for cashier login
            role: 'cashier',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            isGoogleUser: false,
            createdBy: currentUser.uid // Track which admin created this cashier
          };
          
          await setDoc(doc(db, 'users', result.user.uid), newUser);
          
          // Immediately sign out the newly created cashier user
          await signOut(auth);
          
          // Store admin session info for potential restoration
          localStorage.setItem('lastAdminSession', JSON.stringify(adminSessionInfo));
          
          console.log('✅ Cashier account created successfully:', {
            idNumber: data.idNumber,
            name: data.name,
            createdBy: currentUser.uid,
            internalEmail: finalInternalEmail,
            attempt: attempt,
            note: 'Admin session has been signed out. Admin will need to sign in again.'
          });
          
          return newUser;
        } catch (createError) {
          if (createError instanceof Error && createError.message.includes('email-already-in-use')) {
            // Email already exists in Firebase Auth (from previous deletion)
            console.log(`⚠️ Firebase Auth email ${finalInternalEmail} already exists, trying alternative...`);
            finalInternalEmail = `cashier.${currentUser.uid}.${data.idNumber}.${attempt}@receiptmaster.internal`;
            attempt++;
          } else {
            // Re-throw other errors
            throw createError;
          }
        }
      }
      
      // If we get here, all attempts failed
      throw new Error('Unable to create cashier account. Please try a different ID number.');
    } catch (error) {
      console.error('Error creating cashier account:', error);
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          throw new Error('An account with this ID number already exists');
        } else if (error.message.includes('weak-password')) {
          throw new Error('Password is too weak. Please use at least 6 characters');
        } else if (error.message.includes('invalid-email')) {
          throw new Error('Invalid ID number format');
        } else if (error.message.includes('ID number must be in format')) {
          throw error; // Re-throw validation errors
        } else if (error.message.includes('You have already created a cashier with the ID number')) {
          throw error; // Re-throw ID number existence errors
        } else {
          throw new Error(`Failed to create cashier account: ${error.message}`);
        }
      }
      throw new Error('Failed to create cashier account');
    }
  }

  // Change Password (for cashiers)
  async changePassword(newPassword: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      await updatePassword(auth.currentUser, newPassword);
      
      // Update the user document with timestamp
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Failed to change password. Please try signing in again.');
    }
  }

  // Send Password Reset Email
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Get User Data by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? userDoc.data() as User : null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Get All Cashiers (Admin only) - Only returns cashiers created by the current admin
  async getAllCashiers(): Promise<User[]> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No admin user is currently signed in');
      }

      // Get cashiers created by the current admin
      const cashierQuery = query(
        collection(db, 'users'), 
        where('role', '==', 'cashier'),
        where('createdBy', '==', currentUser.uid)
      );
      const cashierSnapshot = await getDocs(cashierQuery);
      return cashierSnapshot.docs.map(doc => doc.data() as User);
    } catch (error) {
      console.error('Error getting cashiers:', error);
      return [];
    }
  }

  // Delete Cashier Account (Admin only) - Removes from Firestore and marks for cleanup
  async deleteCashierAccount(cashierId: string): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No admin user is currently signed in');
      }

      // Get the cashier document to verify ownership and get email
      const cashierDoc = await getDoc(doc(db, 'users', cashierId));
      if (!cashierDoc.exists()) {
        throw new Error('Cashier account not found');
      }

      const cashierData = cashierDoc.data() as User;
      
      // Verify the cashier was created by the current admin
      if (cashierData.createdBy !== currentUser.uid) {
        throw new Error('You can only delete cashiers you created');
      }

      // Verify it's actually a cashier
      if (cashierData.role !== 'cashier') {
        throw new Error('You can only delete cashier accounts');
      }

      // Store the internal email before deleting the document
      const internalEmail = cashierData.email;

      // Delete from Firestore
      await deleteDoc(doc(db, 'users', cashierId));

      // Note: Firebase Auth user deletion requires server-side Admin SDK
      // For now, we'll rely on Firestore security rules to prevent access
      // The cashier will be unable to sign in since their document is deleted
      // In a production environment, you would implement a server-side function
      // to delete the Firebase Auth user using the Admin SDK
      
      console.log('✅ Cashier account deleted successfully:', {
        cashierId: cashierId,
        cashierName: cashierData.name,
        deletedBy: currentUser.uid,
        internalEmail: internalEmail,
        note: 'Firebase Auth user remains but cannot sign in due to missing Firestore document'
      });
    } catch (error) {
      console.error('Error deleting cashier account:', error);
      throw error;
    }
  }

  // Listen to Auth State Changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            callback(userDoc.data() as User);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('Error getting user data:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();