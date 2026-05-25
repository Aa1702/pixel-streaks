import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDewU5eyPk8Jt2UfTV67kpySlr0njSV234",
  authDomain: "pixel-streaks.firebaseapp.com",
  projectId: "pixel-streaks",
  storageBucket: "pixel-streaks.firebasestorage.app",
  messagingSenderId: "1062766895942",
  appId: "1:1062766895942:web:6cd26c9f330c706d52fb47",
  measurementId: "G-JXKY0PLYH8"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);