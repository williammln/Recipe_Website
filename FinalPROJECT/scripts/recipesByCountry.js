// Import the db from your Firebase config
import { db } from './firebase-config.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

async function fetchAndDisplayRecipesByCountry(country) {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = ''; // Clear previous content

    console.log(`Fetching recipes for country: ${country}`);

    // Adjusting the country format to match Firestore
    const formattedCountry = country.charAt(0).toUpperCase() + country.slice(1);
    console.log(`Formatted country: ${formattedCountry}`);

    // Create a query against the collection.
    const recipesQuery = query(collection(db, 'recipes'), where('country', '==', formattedCountry));

    try {
        const querySnapshot = await getDocs(recipesQuery);

        if (querySnapshot.empty) {
            console.log('No recipes found for this country.');
            recipesContainer.innerHTML = `<p>No recipes found for ${formattedCountry}.</p>`;
            return;
        }

        // Go through each document and display its content
        querySnapshot.forEach(doc => {
            const recipe = doc.data();
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');
            
            recipeElement.innerHTML = `
                <h3>${recipe.name}</h3>
                <img src="${recipe.imageUrl}" alt="${recipe.name}" class="recipe-image">
                <p>${recipe.description}</p>
            `;

            recipesContainer.appendChild(recipeElement);
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        recipesContainer.innerHTML = `<p>Error fetching recipes. Please try again later.</p>`;
    }
}

// Function to extract country from URL parameters and format it
function getCountryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const countryKebabCase = params.get('country');
    if (!countryKebabCase) return null;

    return countryKebabCase
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Main function to initialize the page content
async function initPage() {
    const country = getCountryFromURL();
    console.log(`Country from URL: ${country}`);
    if (country) {
        await fetchAndDisplayRecipesByCountry(country);
    } else {
        document.getElementById('recipesContainer').innerHTML = `<p>Country not specified.</p>`;
    }
}

// Wait for the DOM to be fully loaded before executing
document.addEventListener('DOMContentLoaded', initPage);
