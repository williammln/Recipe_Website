import { db } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

async function fetchAndDisplayRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        console.error("Recipe ID is missing in the URL");
        return;
    }

    const recipeDocRef = doc(db, "recipes", recipeId);
    const recipeDocSnap = await getDoc(recipeDocRef);

    if (recipeDocSnap.exists()) {
        const recipeData = recipeDocSnap.data();

        // Fetch user document to get the username
        const userDocRef = doc(db, "users", recipeData.userId);
        const userDocSnap = await getDoc(userDocRef);
        let username = "Unknown"; // Default username
        if (userDocSnap.exists()) {
            username = userDocSnap.data().username; // Get the username from the user document
        }

        document.getElementById('recipeName').textContent = recipeData.recipeName;
        document.getElementById('recipeImage').src = recipeData.imageUrl;
        document.getElementById('recipeImage').alt = recipeData.recipeName;
        document.getElementById('recipeCountry').textContent = recipeData.country;
        document.getElementById('recipeFoodGroup').textContent = recipeData.foodGroup;
        document.getElementById('recipeCreatedBy').textContent = username; // Display the username
        recipeData.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            document.getElementById('recipeIngredients').appendChild(li);
        });
        recipeData.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            document.getElementById('recipeInstructions').appendChild(li);
        });
        if (recipeData.note) {
            document.getElementById('recipeNote').textContent = `Note: ${recipeData.note}`;
        }
    } else {
        console.error("Recipe does not exist.");
    }
}

fetchAndDisplayRecipe();

