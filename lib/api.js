/**
 * Fetches recipes with pagination, filtering, sorting, and search
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @param {string} [search] - Search query
 * @returns {Promise<Object>} - Object containing recipes array and pagination info
 */
export async function getRecipes({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "title",
  order = "asc",
  category = "",
}) {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order,
    });

    if (search) params.append("search", search);
    if (category) params.append("category", category);

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
      recipes: [],
      total: 0,
      totalPages: 0,
      categories: [],
    };
  }
}

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
    const response = await fetch(`http://localhost:3000/api/recipes/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Recipe not found");
      }
      throw new Error("Failed to fetch recipe details");
    }

    const recipe = await response.json();
    return recipe;
  } catch (error) {
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
}

/**
 * Fetches all available recipe categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  try {
    const response = await fetch("http://localhost:3000/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();
    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
}
