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
    apiKey: "AIzaSyBoQT4L3shuLfXGgQeQKR6jv2V0zA-Xnk0",
    authDomain: "cullyfitness.firebaseapp.com",
    databaseURL: "https://cullyfitness-default-rtdb.firebaseio.com",
    projectId: "cullyfitness",
    storageBucket: "cullyfitness.appspot.com",
    messagingSenderId: "247341957335",
    appId: "1:247341957335:web:2bc8166677cbf02fe5f092"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase