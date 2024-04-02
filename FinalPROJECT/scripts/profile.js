import { auth, db } from './firebase-config.js';
import {
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

// Correctly import 'onAuthStateChanged' from the 'firebase/auth' package
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in, now we can safely load the profile and recipes.
    loadUserProfile();
    loadUserRecipes();
  } else {
    // User is signed out
    console.error('No user is currently logged in');
  }
});

async function loadUserProfile() {
  const user = auth.currentUser;
  if (user) {
    const userProfileDoc = await getDoc(doc(db, 'users', user.uid));
    if (userProfileDoc.exists()) {
      const userData = userProfileDoc.data();
      document.getElementById('firstName').value = userData.firstName || '';
      document.getElementById('lastName').value = userData.lastName || '';
      document.getElementById('username').value = userData.username || '';
      document.getElementById('email').value = user.email; // Populate the email field
    } else {
      console.error('No user profile found');
    }
  }
}

async function loadUserRecipes() {
  const user = auth.currentUser;
  if (user) {
    const recipesList = document.getElementById('recipes-list');
    const q = query(collection(db, 'recipes'), where('userId', '==', user.uid));
    const querySnapshot = await getDocs(q);
    recipesList.innerHTML = ''; // Clear the list before adding updated items
    querySnapshot.forEach((doc) => {
      const recipeData = doc.data();
      const recipeItem = document.createElement('div');
      recipeItem.innerHTML = `
        <div class="recipe">
          <img src="${recipeData.imageUrl}" alt="${recipeData.recipeName}">
          <h3>${recipeData.recipeName}</h3>
          <button onclick="deleteRecipe('${doc.id}')">Delete</button>
        </div>
      `;
      recipesList.appendChild(recipeItem);
    });
  }
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const user = auth.currentUser;
  if (!user) {
    console.error('No user is currently logged in');
    return;
  }

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const newPassword = document.getElementById('new-password').value;

  try {
    await updateDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      username
    });
    
    if (email !== user.email || newPassword) {
      const currentPassword = prompt('Please enter your current password for security purposes:'); // This should ideally be done using a secure form input.
      
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      if (email !== user.email) {
        await updateEmail(user, email);
      }
      
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
    }
    
    alert('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    alert(`Error updating profile: ${error.message}`);
  }
});

async function deleteRecipe(recipeId) {
    try {
        await deleteDoc(doc(db, 'recipes', recipeId));
        console.log('Recipe deleted successfully');
        // Refresh the recipes list after deletion
        loadUserRecipes();
    } catch (error) {
        console.error('Error deleting recipe:', error);
    }
}

// Attach the deleteRecipe function to the window object
window.deleteRecipe = deleteRecipe;



