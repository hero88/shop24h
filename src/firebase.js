import firebase from 'firebase/app';

import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA2pwl_4ZXarA9XoHhbrKvNwl12NtgWzsE",
    authDomain: "devcamp-r10-235e7.firebaseapp.com",
    projectId: "devcamp-r10-235e7",
    storageBucket: "devcamp-r10-235e7.appspot.com",
    messagingSenderId: "440994258486",
    appId: "1:440994258486:web:df86b42a7c311411c48297"
}

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
