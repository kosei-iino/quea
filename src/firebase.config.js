import firebase from 'firebase';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD4Ilr4UC1yhhjQnFXwDuhTwgPcy_BYMBA",
  authDomain: "quea-c6fc1.firebaseapp.com",
  projectId: "quea-c6fc1",
  storageBucket: "quea-c6fc1.appspot.com",
  messagingSenderId: "948532713412",
  appId: "1:948532713412:web:71a282a9694b0aab603691",
  measurementId: "G-BCG4860Q9P"
}
firebase.initializeApp(firebaseConfig);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
export default firebase