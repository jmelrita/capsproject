import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
    apiKey: "AIzaSyB8FEgh5hZEGQ7UAjDXCUpvtP8Wmh5K5lo",
    authDomain: "pa-healot.firebaseapp.com",
    projectId: "pa-healot",
    storageBucket: "pa-healot.appspot.com",
    messagingSenderId: "926242841802",
    appId: "1:926242841802:web:08209aec3607c81c5f0033",
    measurementId: "G-5P8S7Q6C1D"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }