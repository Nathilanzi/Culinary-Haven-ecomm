/**
 * Fetches recipes with pagination support
 * @param {Object} params - Pagination parameters
 * @param {number} [params.page=1] - Current page number
 * @param {number} [params.limit=12] - Number of items per page
 * @returns {Promise<{recipes: Array, total: number, totalPages: number}>}
 */
export async function getRecipes({ page = 1, limit = 12 } = {}) {
  // Convert pagination parameters to URL search params
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  try {
    // Make API request with pagination parameters
    const response = await fetch(`/api/recipes?${params}`);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
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
    throw new Error(`Error fetching recipes: ${error.message}`);
  }
}
