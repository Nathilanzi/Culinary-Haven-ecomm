/**
 * Core API functions for recipe management with enhanced pagination and error handling
 */

// Constants for pagination and API limits
const API_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  SORT_ORDERS: ['asc', 'desc'],
  DEFAULT_SORT: '$natural',
  DEFAULT_ORDER: 'asc'
};

/**
 * Validates and sanitizes pagination parameters
 * @param {number} page - Requested page number
 * @param {number} limit - Requested items per page
 * @returns {Object} Sanitized pagination parameters
 */
const sanitizePaginationParams = (page, limit) => ({
  page: Math.max(API_CONSTANTS.DEFAULT_PAGE, Number(page) || API_CONSTANTS.DEFAULT_PAGE),
  limit: Math.min(
    Math.max(API_CONSTANTS.MIN_LIMIT, Number(limit) || API_CONSTANTS.DEFAULT_LIMIT),
    API_CONSTANTS.MAX_LIMIT
  )
});

/**
 * Validates and sanitizes sorting parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Object} Sanitized sorting parameters
 */
const sanitizeSortParams = (sortBy, order) => ({
  sortBy: sortBy || API_CONSTANTS.DEFAULT_SORT,
  order: API_CONSTANTS.SORT_ORDERS.includes(order?.toLowerCase())
    ? order.toLowerCase()
    : API_CONSTANTS.DEFAULT_ORDER
});

/**
 * Fetches recipes with enhanced pagination, filtering, sorting, search, and tag matching
 * @param {Object} params - Query parameters for fetching recipes
 * @param {number} [params.page=1] - Page number (1-indexed)
 * @param {number} [params.limit=20] - Number of items per page (max 100)
 * @param {string} [params.search=""] - Search query
 * @param {string} [params.sortBy="$natural"] - Field to sort by
 * @param {string} [params.order="asc"] - Sort order ('asc' or 'desc')
 * @param {string} [params.category=""] - Recipe category
 * @param {Array<string>} [params.tags=[]] - Tags to filter by
 * @param {string} [params.tagMatchType="all"] - Tag match type ('all' or 'any')
 * @param {Array<string>} [params.ingredients=[]] - Ingredients to filter by
 * @param {string} [params.ingredientsMatchType="all"] - Ingredients match type ('all' or 'any')
 * @param {number|null} [params.numberOfSteps=null] - Number of steps filter
 * @returns {Promise<Object>} - Object containing recipes array and pagination metadata
 * @throws {Error} When the API request fails
 */
export async function getRecipes({
  page = API_CONSTANTS.DEFAULT_PAGE,
  limit = API_CONSTANTS.DEFAULT_LIMIT,
  search = "",
  sortBy = API_CONSTANTS.DEFAULT_SORT,
  order = API_CONSTANTS.DEFAULT_ORDER,
  category = "",
  tags = [],
  tagMatchType = "all",
  ingredients = [],
  ingredientsMatchType = "all",
  numberOfSteps = null,
}) {
  try {
    // Sanitize pagination and sorting parameters
    const { page: validPage, limit: validLimit } = sanitizePaginationParams(page, limit);
    const { sortBy: validSortBy, order: validOrder } = sanitizeSortParams(sortBy, order);

    // Build query parameters
    const params = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      sortBy: validSortBy,
      order: validOrder,
    });

    // Add optional parameters
    if (search?.trim()) params.append("search", search.trim());
    if (category?.trim()) params.append("category", category.trim());
    if (numberOfSteps !== null && !isNaN(numberOfSteps)) {
      params.append("numberOfSteps", Math.max(0, parseInt(numberOfSteps)));
    }

    // Handle tags
    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach(tag => tag?.trim() && params.append("tags[]", tag.trim()));
      params.append("tagMatchType", tagMatchType === "any" ? "any" : "all");
    }

    // Handle ingredients
    if (Array.isArray(ingredients) && ingredients.length > 0) {
      ingredients.forEach(ingredient => 
        ingredient?.trim() && params.append("ingredients[]", ingredient.trim())
      );
      params.append("ingredientsMatchType", ingredientsMatchType === "any" ? "any" : "all");
    }

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch recipes: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Ensure consistent response structure
    return {
      recipes: data.recipes || [],
      total: data.total || 0,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / validLimit),
      currentPage: validPage,
      limit: validLimit,
      hasNextPage: validPage < (data.totalPages || Math.ceil((data.total || 0) / validLimit)),
      hasPreviousPage: validPage > 1
    };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Return safe default values
    return {
      recipes: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      limit: limit,
      hasNextPage: false,
      hasPreviousPage: false,
      error: error.message
    };
  }
}

/**
 * Fetches recipe suggestions based on a search query with pagination
 * @param {string} query - Search query
 * @param {number} [limit=10] - Maximum number of suggestions to return
 * @returns {Promise<Array>} - Array of suggestion objects
 */
export async function getRecipeSuggestions(query, limit = 10) {
  try {
    if (!query?.trim()) return [];

    const validLimit = Math.min(Math.max(1, Number(limit)), API_CONSTANTS.MAX_LIMIT);
    
    const params = new URLSearchParams({
      q: query.trim(),
      limit: validLimit.toString()
    });

    const response = await fetch(
      `http://localhost:3000/api/suggestions?${params}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch suggestions: ${response.status} ${response.statusText}`
      );
    }

    const { suggestions = [] } = await response.json();
    return suggestions;
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
    if (!id?.trim()) throw new Error("Recipe ID is required");

    const response = await fetch(`http://localhost:3000/api/recipes/${id.trim()}`);
    
    if (!response.ok) {
      if (response.status === 404) throw new Error("Recipe not found");
      throw new Error(`Failed to fetch recipe details: ${response.status} ${response.statusText}`);
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
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const categories = await response.json();
    return Array.isArray(categories) ? categories : [];
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
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
    }

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
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ingredients: ${response.status} ${response.statusText}`);
    }

    const ingredients = await response.json();
    return Array.isArray(ingredients) ? ingredients : [];
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
  }
}

// Endpoint base URL
const BASE_URL = "http://localhost:3000/api";

/**
 * Fetches the list of favorite recipes
 * @returns {Promise<Array>} - Array of favorite recipe objects
 */
export async function getFavorites() {
  try {
    const response = await fetch(`${BASE_URL}/favorites`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.status} ${response.statusText}`);
    }

    const favorites = await response.json();
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

/**
 * Adds a recipe to favorites
 * @param {string} recipeId - The ID of the recipe to add to favorites
 * @returns {Promise<Object>} - The added favorite recipe object
 * @throws {Error} When the API request fails
 */
export async function addFavorite(recipeId) {
  try {
    const response = await fetch(`${BASE_URL}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ recipeId })
    });

    if (!response.ok) {
      throw new Error(`Failed to add favorite: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding favorite:", error);
    throw error;
  }
}
