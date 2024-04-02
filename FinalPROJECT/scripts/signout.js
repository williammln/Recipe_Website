import { auth } from './firebase-config.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

async function signOutUser(event) {
    event.preventDefault(); // Prevent the default link action
    try {
        await signOut(auth);
        console.log('User signed out successfully');
        // Redirect the topmost window to index.html
        window.top.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// Add event listener to sign-out link
const signOutLink = document.getElementById('signOutLink');
signOutLink.addEventListener('click', signOutUser);
