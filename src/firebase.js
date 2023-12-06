import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD0MlHhBIIiBwmHDNWbMUhw-zuL2QY4UGs",
    authDomain: "maristhungerexpress.firebaseapp.com",
    projectId: "maristhungerexpress",
    storageBucket: "maristhungerexpress.appspot.com",
    messagingSenderId: "1097192701035",
    appId: "1:1097192701035:web:9059ed729638d68e58c52e"
};

const app = firebase.initializeApp(firebaseConfig);
const storage = app.storage();

export { storage };
