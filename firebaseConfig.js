import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfDq2attDqWMrxVXrJxLtFdP3rSXTZFXo",
  authDomain: "cully-strength.firebaseapp.com",
  projectId: "cully-strength",
  storageBucket: "cully-strength.appspot.com",
  messagingSenderId: "374950825055",
  appId: "1:374950825055:web:c6452a92677096d8bd1fea",
  measurementId: "G-R739SFTWWT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase