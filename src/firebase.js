// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore } from "firebase/firestore";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrwnCHqAM9UHaovq1kR2Z9d0VY4qpJAB4",
  authDomain: "realtor-clone-dfe0f.firebaseapp.com",
  projectId: "realtor-clone-dfe0f",
  storageBucket: "realtor-clone-dfe0f.appspot.com",
  messagingSenderId: "1048474887486",
  appId: "1:1048474887486:web:8d4a1ce46a4164c5fdb86f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()