import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNz5bAtfilE9FlR7Xjw_pdi_dNVq3YcpE",
  authDomain: "hotelapp-4f942.firebaseapp.com",
  projectId: "hotelapp-4f942",
  storageBucket: "hotelapp-4f942.firebasestorage.app",
  messagingSenderId: "881078540927",
  appId: "1:881078540927:web:3e4a03fc36cdf9ba257d4a"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;