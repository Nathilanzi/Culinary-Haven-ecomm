/**
 * Fetches a single recipe by ID
 * @param {string} id - Recipe ID
 * @returns {Promise<Object>} - Recipe object
 */
export async function getRecipeById(id) {
  if (!id) {
    throw new Error("Recipe ID is required");
  }

  try {
    // API call to fetch the recipe by ID
    const response = await fetch(`http://localhost:3000/api/recipes/${id}`);

    // Check if the request was successful
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Recipe not found");
      }
      throw new Error("Failed to fetch recipe details");
    }

    // Parse and return the recipe data
    const recipe = await response.json();
    return recipe;
  } catch (error) {
    // Handle and rethrow any errors that occur during the fetch
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
}

export async function getRecipes(page = 1, limit = 20) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      recipes: [],
      total: 0,
      totalPages: 0,
    };
  }
}

/**
 * Fetches all available recipe categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  try {
    // Make API request to fetch categories
    const response = await fetch("/api/categories");

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to create categories");
    }

    // Parse and return the response data
    return response.json();
  } catch (error) {
    // Handle and rethrow any errors that occur during the fetch
    throw new Error(`Error creating categories: ${error.message}`);
  }
}
