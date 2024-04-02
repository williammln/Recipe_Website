import { db } from './firebase-config.js';
import { collection, getDocs, doc, getDoc, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';

async function fetchRecipes() {
    const recipesContainer = document.getElementById('recipesContainer');
    recipesContainer.innerHTML = ''; // Clear current recipes

    const q = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    for (const recipeDoc of querySnapshot.docs) {
        const recipe = recipeDoc.data();
        // Fetch username using the user ID from each recipe
        const userDocRef = doc(db, "users", recipe.userId);
        const userDocSnap = await getDoc(userDocRef);

        let username = "Unknown";
        if (userDocSnap.exists()) {
            username = userDocSnap.data().username;
        }

        // Generate HTML for each recipe
        const recipeCardHTML = `
            <div class="recipe-card" onclick="window.location.href='viewRecipe.html?id=${recipeDoc.id}'">
                <img src="${recipe.imageUrl}" alt="${recipe.recipeName}" />
                <h3>${recipe.recipeName}</h3>
                <p>Created by: ${username}</p>
            </div>
        `;
        recipesContainer.innerHTML += recipeCardHTML;
    }
}

async function fetchRecentRecipes() {
  const recentRecipesContainer = document.getElementById('recentRecipes');
  recentRecipesContainer.innerHTML = ''; // Clear existing content

  // Adjusted to limit to the latest three recipes
  const recentQuery = query(collection(db, 'recipes'), orderBy('createdAt', 'desc'), limit(3));
  const querySnapshot = await getDocs(recentQuery);

  for (const recipeDoc of querySnapshot.docs) {
    const recipe = recipeDoc.data();
    const userDocRef = doc(db, "users", recipe.userId);
    const userDocSnap = await getDoc(userDocRef);
    
    let username = "Unknown";
    if (userDocSnap.exists()) {
      username = userDocSnap.data().username;
    }

    // Create HTML for each recipe
    const recipeCardHTML = `
      <div class="recipe-card" onclick="window.location.href='viewRecipe.html?id=${recipeDoc.id}'">
          <img src="${recipe.imageUrl}" alt="${recipe.recipeName}" class="recipe-image" />
          <h3>${recipe.recipeName}</h3>
          <p>Created by: ${username}</p>
      </div>
    `;
    recentRecipesContainer.innerHTML += recipeCardHTML;
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  await displayFlags();
  // Additional setup functions can be called here
});

async function displayFlags() {
  const flagsContainer = document.getElementById('flagsContainer');
  const countryFlags = [
    { country: "Algeria", image: "algeria_flag.webp" },
    { country: "Angola", image: "angola_flag.webp" },
    { country: "Botswana", image: "botswana_flag.webp" },
    { country: "Burkina Faso", image: "burkina_faso_flag.webp" },
    { country: "Burundi", image: "burundi_flag.webp" },
    { country: "Cameroon", image: "cameroon_flag.webp" },
    { country: "Cape Verde", image: "cape_verde_flag.webp" },
    { country: "Central African Republic", image: "central_african_republic.webp" },
    { country: "Chad", image: "chad_flag.webp" },
    { country: "Comoros", image: "comoros_flag.webp" },
    { country: "Congo (DRC)", image: "congo_drc_flag.webp" },
    { country: "Congo (Republic of the)", image: "congo_republic_of_the_flag.webp" },
    { country: "Côte d'Ivoire", image: "cote_d_Ivoire_flag.webp" },
    { country: "Djibouti", image: "djibouti_flag.webp" },
    { country: "Egypt", image: "egypt_flag.webp" },
    { country: "Eritrea", image: "eritrea_flag.webp" },
    { country: "Ethiopia", image: "ethiopia_flag.webp" },
    { country: "Gabon", image: "gabon_flag.webp" },
    { country: "Gambia", image: "gambia_flag.webp" },
    { country: "Ghana", image: "ghana_flag.webp" },
    { country: "Guinea", image: "guinea_flag.webp" },
    { country: "Guinea-Bissau", image: "guinea-bissau_flag.webp" },
    { country: "Kenya", image: "kenya_flag.webp" },
    { country: "Lesotho", image: "lesotho_flag.webp" },
    { country: "Liberia", image: "liberia_flag.webp" },
    { country: "Libya", image: "libya_flag_new.webp" },
    { country: "Madagascar", image: "madagascar_flag.webp" },
    { country: "Malawi", image: "malawi_flag.webp" },
    { country: "Mali", image: "mali_flag.webp" },
    { country: "Mauritania", image: "mauritania_flag.webp" },
    { country: "Mauritius", image: "mauritius_flag.webp" },
    { country: "Morocco", image: "morocco_flag.webp" },
    { country: "Mozambique", image: "mozambique_flag.webp" },
    { country: "Namibia", image: "namibia_flag.webp" },
    { country: "Niger", image: "niger_flag.webp" },
    { country: "Nigeria", image: "nigeria_flag.webp" },
    { country: "Rwanda", image: "rwanda_flag.webp" },
    { country: "Sao Tome and Principe", image: "sao_tome_and_principe_flag.webp" },
    { country: "Senegal", image: "senegal_flag.webp" },
    { country: "Seychelles", image: "seychelles_flag.webp" },
    { country: "Sierra Leone", image: "sierra_leone_flag.webp" },
    { country: "Somalia", image: "somalia_flag.webp" },
    { country: "South Africa", image: "south_africa_flag.webp" },
    { country: "South Sudan", image: "south_sudan-flag.webp" },
    { country: "Sudan", image: "sudan_flag.webp" },
    { country: "Swaziland", image: "swaziland_flag.webp" },
    { country: "Tanzania", image: "tanzania_flag.webp" },
    { country: "Togo", image: "togo_flag.webp" },
    { country: "Tunisia", image: "tunisia_flag.webp" },
    { country: "Uganda", image: "uganda_flag.webp" },
    { country: "Western Sahara", image: "western_sahara_flag.webp" },
    { country: "Zambia", image: "zambia_flag.webp" },
    { country: "Zimbabwe", image: "zimbabwe_flag.webp" }
];


  countryFlags.forEach(({ country, image }) => {
    const flagItem = document.createElement('div');
    flagItem.className = 'flag-item';
    flagItem.innerHTML = `
      <img src="flags/${image}" alt="${country} Flag">
      <p>${country}</p>
    `;

    // Handle click event
    flagItem.addEventListener('click', () => {
      window.location.href = `recipesByCountry.html?country=${country}`; // Adjust URL as needed
    });

    flagsContainer.appendChild(flagItem);
  });
}


async function setupSearch() {
  const searchBar = document.getElementById('searchBar');
  const recipesSearch = document.getElementById('recipesSearch');

  // Fetch all recipes data once
  let allRecipes = [];
  const recipesQuery = query(collection(db, 'recipes'));
  const querySnapshot = await getDocs(recipesQuery);

  // Fetch usernames in parallel and assign them to their recipes
  const usernames = {};
  const userPromises = querySnapshot.docs.map(async recipeDoc => {
    const recipeData = recipeDoc.data();
    if (!usernames[recipeData.userId]) { // Fetch each user's name once
      const userSnapshot = await getDoc(doc(db, "users", recipeData.userId));
      usernames[recipeData.userId] = userSnapshot.exists() ? userSnapshot.data().username : "Unknown";
    }
    return {
      ...recipeData,
      id: recipeDoc.id,
      username: usernames[recipeData.userId] // Assign fetched username
    };
  });

  allRecipes = await Promise.all(userPromises);

  searchBar.addEventListener('input', () => {
    const searchText = searchBar.value.trim().toLowerCase();
    recipesSearch.innerHTML = ''; // Clear previous search results

    if (!searchText) {
      return;
    }

    // Filter recipes based on search text
    const filteredRecipes = allRecipes.filter(({ recipeName, username, country }) =>
      recipeName.toLowerCase().includes(searchText) ||
      username.toLowerCase().includes(searchText) ||
      (country && country.toLowerCase().includes(searchText))
    );

    // Generate and display filtered recipe cards
    filteredRecipes.forEach(recipe => {
      const recipeCardHTML = `
        <div class="recipe-card" onclick="window.location.href='viewRecipe.html?id=${recipe.id}'">
          <img src="${recipe.imageUrl}" alt="${recipe.recipeName}" class="recipe-image" />
          <h3>${recipe.recipeName}</h3>
          <p>Created by: ${recipe.username}</p>
        </div>
      `;
      recipesSearch.innerHTML += recipeCardHTML;
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  setupSearch().catch(console.error);
});


document.addEventListener('DOMContentLoaded', async () => {
    await fetchRecipes();
    await fetchRecentRecipes();
    await fetchRecipesByCountry();
});





