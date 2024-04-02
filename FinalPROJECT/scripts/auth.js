// auth.js
import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

// Function to handle user registration
async function registerUser(email, password, firstName, lastName, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user information in Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email
    });

    // Display success message
    document.getElementById('register-success').style.display = 'block';
    document.getElementById('register-success').textContent = 'Account created successfully!';
    document.getElementById('register-error').style.display = 'none';

    console.log('User registered with additional info:', user);
    // Optionally, redirect the user or perform other actions

  } catch (error) {
    // Display error message
    document.getElementById('register-error').style.display = 'block';
    document.getElementById('register-error').textContent = `Failed to create account: ${error.message}`;
    document.getElementById('register-success').style.display = 'none';

    console.error('Error during registration:', error.code, error.message);
  }
}

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user's email in local storage
    localStorage.setItem('userEmail', user.email);

    console.log('User logged in:', user);
    
    // Redirect to main.html
    window.location.href = 'main.html';
  } catch (error) {
    console.error('Error during login:', error.code, error.message);
    document.getElementById('login-error').textContent = error.message;
    document.getElementById('login-error').style.display = 'block';
  }
}


// Combined Event listener for both registration and login forms
document.addEventListener('DOMContentLoaded', () => {
  // Listener for registration form
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Hide messages
      document.getElementById('register-error').style.display = 'none';
      document.getElementById('register-success').style.display = 'none';

      const email = registrationForm['email'].value;
      const password = registrationForm['password'].value;
      const firstName = registrationForm['firstName'].value;
      const lastName = registrationForm['lastName'].value;
      const username = registrationForm['username'].value;
      registerUser(email, password, firstName, lastName, username);
    });
  }

  // Listener for login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Hide previous error messages
      document.getElementById('login-error').style.display = 'none';

      const email = loginForm['email'].value;
      const password = loginForm['password'].value;
      loginUser(email, password);
    });
  }
});
