lib/api.js
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
  sortBy = "$natural",
  order = "asc",
  category = "",
  tags = [],
  tagMatchType = "all",
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
    if (tags.length > 0) {
      tags.forEach((tag) => params.append("tags[]", tag));
      params.append("tagMatchType", tagMatchType);
    }

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
 * Fetches recipe suggestions based on search query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - Array of suggestion objects
 */
export async function getRecipeSuggestions(query) {
  try {
    if (!query) return [];

    const response = await fetch(
      `http://localhost:3000/api/suggestions?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await response.json();
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

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

export async function getTags() {
  try {
    const response = await fetch('http://localhost:3000/api/tags');
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    const tags = await response.json();
    return Array.isArray(tags) ? tags : [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}
