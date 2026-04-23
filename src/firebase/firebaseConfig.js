import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBNwwvYrcznswVHIei8ZLmrO_daAajiMh8",
  authDomain: "facultyexpensetracker.firebaseapp.com",
  projectId: "facultyexpensetracker",
  storageBucket: "facultyexpensetracker.firebasestorage.app",
  messagingSenderId: "311313614416",
  appId: "1:311313614416:web:356b9331ff77d9b52a7355",
  measurementId: "G-0JY6YTKNG0"
};

export const app = initializeApp(firebaseConfig);
