import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const COLLECTIONS = {
  USERS: 'users',
  HOTELS: 'hotels',
  BOOKINGS: 'bookings',
  REVIEWS: 'reviews'
};

export const userService = {
  createUserProfile: async (userId, userData) => {
    try {
      await addDoc(collection(db, COLLECTIONS.USERS), {
        userId,
        ...userData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const q = query(collection(db, COLLECTIONS.USERS), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      const userProfile = await userService.getUserProfile(userId);
      if (userProfile) {
        const userRef = doc(db, COLLECTIONS.USERS, userProfile.id);
        await updateDoc(userRef, { ...updates, updatedAt: Timestamp.now() });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

export const hotelService = {
  getAllHotels: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.HOTELS));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting hotels:', error);
      throw error;
    }
  },

  getHotelById: async (hotelId) => {
    try {
      const docRef = doc(db, COLLECTIONS.HOTELS, hotelId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting hotel:', error);
      throw error;
    }
  }
};

export const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.BOOKINGS), {
        ...bookingData,
        status: 'confirmed',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  getUserBookings: async (userId) => {
    try {
      const q = query(collection(db, COLLECTIONS.BOOKINGS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  },

  cancelBooking: async (bookingId) => {
    try {
      const bookingRef = doc(db, COLLECTIONS.BOOKINGS, bookingId);
      await updateDoc(bookingRef, { status: 'cancelled', updatedAt: Timestamp.now() });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }
};

export const reviewService = {
  createReview: async (reviewData) => {
    try {
      await addDoc(collection(db, COLLECTIONS.REVIEWS), {
        ...reviewData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  getHotelReviews: async (hotelId) => {
    try {
      const q = query(collection(db, COLLECTIONS.REVIEWS), where('hotelId', '==', hotelId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting hotel reviews:', error);
      throw error;
    }
  },

  getUserReviews: async (userId) => {
    try {
      const q = query(collection(db, COLLECTIONS.REVIEWS), where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  }
};