import firebase from "firebase/app";
import "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC9A3rGAGgRvDv5dAhYCDApISBxC0T9zmE",
  authDomain: "twister-bcda0.firebaseapp.com",
  projectId: "twister-bcda0",
  storageBucket: "twister-bcda0.appspot.com",
  messagingSenderId: "654597685863",
  appId: "1:654597685863:web:10ffe3c085218870e8cac2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

let db = firebase.firestore()

export default db

