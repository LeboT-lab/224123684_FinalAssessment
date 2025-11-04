import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot 
} from 'firebase/firestore';

export const saveBooking = async (userId, bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings', userId, 'userBookings');
    const bookingDoc = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: new Date(),
      status: 'confirmed'
    });
    console.log('Booking saved with ID:', bookingDoc.id);
    return bookingDoc.id;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const bookingsRef = collection(db, 'bookings', userId, 'userBookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting bookings:', error);
    throw error;
  }
};

export const subscribeToUserBookings = (userId, callback) => {
  const bookingsRef = collection(db, 'bookings', userId, 'userBookings');
  const q = query(bookingsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(bookings);
  });
};