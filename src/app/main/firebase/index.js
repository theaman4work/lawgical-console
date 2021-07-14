import firebase from 'firebase/app';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBhlFmDx5Y0GFWQ7GctaVaecEBwxU-4JOE',
	authDomain: 'lawgical-storage.firebaseapp.com',
	projectId: 'lawgical-storage',
	storageBucket: 'lawgical-storage.appspot.com',
	messagingSenderId: '443080747966',
	appId: '1:443080747966:web:c14621626bce91d08f67ef'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { firebase, storage as default };
