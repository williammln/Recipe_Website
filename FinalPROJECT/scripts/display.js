import { auth, db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const userInfo = document.getElementById('userInfo');

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        userInfo.textContent = `${userData.firstName}, Welcome to:`;
      } else {
        console.log('No user data found in Firestore');
      }
    } else {
      console.log('No user is currently signed in');
    }
  });
});
