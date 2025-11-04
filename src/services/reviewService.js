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

export const addReview = async (hotelId, reviewData) => {
  try {
    const reviewsRef = collection(db, 'reviews', hotelId, 'hotelReviews');
    const reviewDoc = await addDoc(reviewsRef, {
      ...reviewData,
      createdAt: new Date(),
    });
    console.log('Review added with ID:', reviewDoc.id);
    return reviewDoc.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getHotelReviews = async (hotelId) => {
  try {
    const reviewsRef = collection(db, 'reviews', hotelId, 'hotelReviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const subscribeToHotelReviews = (hotelId, callback) => {
  const reviewsRef = collection(db, 'reviews', hotelId, 'hotelReviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const reviews = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(reviews);
  });
};