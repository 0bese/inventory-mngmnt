// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm2mK84Dw9LdxIWQuDfOBUAVxpghnJRMc",
  authDomain: "inventory-mngmnt-ec38a.firebaseapp.com",
  projectId: "inventory-mngmnt-ec38a",
  storageBucket: "inventory-mngmnt-ec38a.appspot.com",
  messagingSenderId: "141091247550",
  appId: "1:141091247550:web:79266013f5fb25d5d515ef",
  measurementId: "G-4H3ETSEK9N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };
