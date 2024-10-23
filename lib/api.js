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

/**
 * Fetches recipes with pagination support
 * @param {Object} params - Pagination parameters
 * @param {number} [params.page=1] - Current page number
 * @param {number} [params.limit=12] - Number of items per page
 * @returns {Promise<{recipes: Array, total: number, totalPages: number}>}
 */
export async function getRecipes({ page = 1, limit = 20 } = {}) {
  // Convert pagination parameters to URL search params
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    // Log the URL being fetched
    console.log("Fetching recipes from URL:", `/api/recipes?${params}`);
    
    // Make API request with pagination parameters
    const response = await fetch(`/api/recipes?${params}`);

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData || "Failed to create recipes");
    }

    // Parse and return the response data
    const data = await response.json();
    return {
      recipes: data.recipes, // Array of recipe objects
      total: data.total, // Total number of recipes
      totalPages: data.totalPages, // Total number of pages
    };
  } catch (error) {
    // Handle and rethrow any errors that occur during the fetch
    throw new Error(`Error creating recipes: ${error.message}`);
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
