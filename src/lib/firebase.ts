// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbhRYOJntYnNy-fzI9IPHVtb3o5JWplgA",
  authDomain: "universal-clipboard-c038f.firebaseapp.com",
  projectId: "universal-clipboard-c038f",
  storageBucket: "universal-clipboard-c038f.appspot.com",
  messagingSenderId: "292844280654",
  appId: "1:292844280654:web:2d4ea3362a17b621b91c1f",
  measurementId: "G-R1GCESN9R8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
