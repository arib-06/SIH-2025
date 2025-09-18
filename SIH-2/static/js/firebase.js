/** @format */

// Import Firebase modules
import {getAnalytics} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-analytics.js';
import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {getFirestore} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

// Your Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAYj1mE60LDw8lpA0zdY1ODIrOEaXTWO2M',
	authDomain: 'sih-2025-e9684.firebaseapp.com',
	projectId: 'sih-2025-e9684',
	storageBucket: 'sih-2025-e9684.firebasestorage.app',
	messagingSenderId: '511592934391',
	appId: '1:511592934391:web:6c4d69ee0b6b56d8179cf2',
	measurementId: 'G-X1ZFQ29NRR',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
window.app = app;
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Expose db globally
export {db,app,analytics};