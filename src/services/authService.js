import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserProfile } from './userService';

const AUTH_STORAGE_KEY = 'userAuthData';

export const authService = {
  signUp: async (email, password, userData) => {
    try {
      if (!email || email === 'undefined' || email === null) {
        return { user: null, error: 'Please enter a valid email address' };
      }

      const safeEmail = String(email).trim();
      const safePassword = String(password);

      const userCredential = await createUserWithEmailAndPassword(auth, safeEmail, safePassword);
      const user = userCredential.user;
      
      if (userData && userData.name) {
        await updateProfile(user, {
          displayName: userData.name
        });
      }
      
      await createUserProfile(user.uid, {
        email: user.email,
        name: userData?.name || '',
        phone: userData?.phone || '',
        createdAt: new Date().toISOString()
      });
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: userData?.name || ''
      }));
      
      return { user, error: null };
    } catch (error) {
      let errorMessage = 'Sign up failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      return { user: null, error: errorMessage };
    }
  },

  signIn: async (email, password) => {
    try {
      const safeEmail = String(email).trim();
      const safePassword = String(password);

      const userCredential = await signInWithEmailAndPassword(auth, safeEmail, safePassword);
      const user = userCredential.user;
      
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || ''
      }));
      
      return { user, error: null };
    } catch (error) {
      let errorMessage = 'Sign in failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      return { user: null, error: errorMessage };
    }
  },

  resetPassword: async (email) => {
    try {
      const safeEmail = String(email).trim();
      await sendPasswordResetEmail(auth, safeEmail);
      return { success: true, error: null };
    } catch (error) {
      let errorMessage = 'Password reset failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else {
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getStoredAuthData: async () => {
    try {
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};