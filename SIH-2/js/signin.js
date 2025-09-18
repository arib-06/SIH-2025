/** @format */
import {getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import {doc, setDoc, getDoc} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import {db} from './firebase.js'
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Function to handle user sign-in
const signInUser = async (email, password) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		console.log('User signed in:', user);

		// Redirect to '/' on successful login
		window.location.href = '/';
	} catch (error) {
		console.error('Error signing in:', error.message);
		document.getElementById('message').textContent = `Error: ${error.message}`;
	}
};

// Add event listener to the login form
const loginForm = document.getElementById('signinForm');

if (loginForm) {
	loginForm.addEventListener('submit', e => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		signInUser(email, password);
	});
}

async function googleLogin() {
	try {
		const result = await signInWithPopup(auth, provider);
		const user = result.user;

		// Save user to Firestore (if not already saved)
		const userRef = doc(db, 'users', user.uid);
		const docSnap = await getDoc(userRef);

		if (!docSnap.exists()) {
			await setDoc(userRef, {
				uid: user.uid,
				name: user.displayName,
				email: user.email,
				photoURL: user.photoURL,
				createdAt: new Date(),
			});
			console.log('New user saved in Firestore ✅');
		} else {
			console.log('User already exists in Firestore');
		}

		alert(`Welcome ${user.displayName}!`);
	} catch (error) {
		console.error('Google Sign-In Error:', error);
	}
}

// Sign out
async function logout() {
	await signOut(auth);
	alert('Signed out successfully!');
}

document.getElementById('signupWithGoogle')
.addEventListener('click', e=>googleLogin());
window.googleLogin = googleLogin;
window.logout = logout;