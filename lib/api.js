/**
 * Fetches recipes with pagination, filtering, sorting, search, and tag matching
 * @param {Object} params - Query parameters for fetching recipes
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Number of items per page
 * @param {string} [params.search=""] - Search query
 * @param {string} [params.sortBy="$natural"] - Field to sort by
 * @param {string} [params.order="asc"] - Sort order ('asc' or 'desc')
 * @param {string} [params.category=""] - Recipe category
 * @param {Array<string>} [params.tags=[]] - Tags to filter by
 * @param {string} [params.tagMatchType="all"] - Tag match type ('all' or 'any')
 * @returns {Promise<Object>} - Object containing recipes array, pagination, and categories
 */
export async function getRecipes({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "$natural",
  order = "asc",
  category = "",
  tags = [],
  tagMatchType = "all",
  numberOfSteps = null,
}) {
  try {
    const params = new URLSearchParams({ page, limit, sortBy, order });

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (numberOfSteps !== null) params.append("numberOfSteps", numberOfSteps);
    if (tags.length > 0) {
      tags.forEach((tag) => params.append("tags[]", tag));
      params.append("tagMatchType", tagMatchType);
    }

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);
    if (!response.ok) throw new Error("Failed to fetch recipes");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { recipes: [], total: 0, totalPages: 0 };
  }
}

/**
 * Fetches recipe suggestions based on a search query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of suggestion objects
 */
export async function getRecipeSuggestions(query) {
  try {
    if (!query) return [];

    const response = await fetch(
      `http://localhost:3000/api/suggestions?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error("Failed to fetch suggestions");

    const { suggestions } = await response.json();
    return suggestions || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

/**
 * Fetches recipe details by ID
 * @param {string} id - Recipe ID
 * @returns {Promise<Object>} - Recipe details object
 */
export async function getRecipeById(id) {
  try {
    if (!id) throw new Error("Recipe ID is required");

    const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Recipe not found");
      throw new Error("Failed to fetch recipe details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    throw error;
  }
}

/**
 * Fetches all available recipe categories
 * @returns {Promise<Array>} - Array of category objects
 */
export async function getCategories() {
  try {
    const response = await fetch("http://localhost:3000/api/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/**
 * Fetches all available tags
 * @returns {Promise<Array>} - Array of tag strings
 */
export async function getTags() {
  try {
    const response = await fetch("http://localhost:3000/api/tags");
    if (!response.ok) throw new Error("Failed to fetch tags");

    const tags = await response.json();
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

/**
 * Fetches all available ingredients
 * @returns {Promise<Array>} - Array of ingredient strings
 */
export async function getIngredients() {
  try {
    const response = await fetch("http://localhost:3000/api/ingredients");
    if (!response.ok) throw new Error("Failed to fetch ingredients");

    const ingredients = await response.json();
    return Array.isArray(ingredients) ? ingredients : [];
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
}
