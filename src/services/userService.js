import { db } from './firebaseConfig';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';

export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email,
      createdAt: new Date(),
    });
    console.log('User profile created successfully');
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserName = async (userId, newName) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      name: newName,
      updatedAt: new Date(),
    });
    console.log('User name updated successfully');
  } catch (error) {
    console.error('Error updating user name:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      throw new Error('User profile not found');
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data());
    }
  });
};