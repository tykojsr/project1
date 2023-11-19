import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCsdtAsXIsA0defGHR8rCO0CdTjpNNivSA",
    authDomain: "web-app-c2223.firebaseapp.com",
    projectId: "web-app-c2223",
    storageBucket: "web-app-c2223.appspot.com",
    messagingSenderId: "964664086270",
    appId: "1:964664086270:web:998a381f89ff636d5fdfaf"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { app, firestore, storage };