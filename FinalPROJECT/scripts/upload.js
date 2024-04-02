import { db, auth } from './firebase-config.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
  const recipeForm = document.getElementById('recipeForm');

  recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const image = recipeForm['image'].files[0]; // The image file
    const country = recipeForm['country'].value;
    const foodGroup = recipeForm['foodgroup'].value;
    const recipeName = recipeForm['recipeName'].value;
    const ingredientsText = recipeForm['ingredients'].value; // Assuming there is a field for ingredients
    const instructionsText = recipeForm['instructions'].value; // Assuming there is a field for instructions
    const note = recipeForm['note'].value;

    // Convert ingredients and instructions from text to array
    const ingredients = ingredientsText.split('\n').filter(line => line.trim() !== '');
    const instructions = instructionsText.split('\n').filter(line => line.trim() !== '');

    if (!auth.currentUser) {
      alert('You must be logged in to upload recipes.');
      return;
    }

    const userId = auth.currentUser.uid;

    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, `recipes/${userId}/${image.name}`);
      await uploadBytes(fileRef, image);
      const imageUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'recipes'), {
        userId,
        recipeName,
        ingredients,
        instructions,
        note,
        country,
        foodGroup,
        imageUrl,
        createdAt: serverTimestamp()
      });

      alert('Recipe uploaded successfully!');
      recipeForm.reset();
    } catch (error) {
      console.error('Error uploading recipe:', error);
      alert(`Error uploading recipe: ${error.message}`);
    }
  });
});
