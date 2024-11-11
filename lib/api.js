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
    const { page: validPage, limit: validLimit } = sanitizePaginationParams(page, limit);
    const { sortBy: validSortBy, order: validOrder } = sanitizeSortParams(sortBy, order);

    const params = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      sortBy: validSortBy,
      order: validOrder,
    });

    if (search?.trim()) params.append("search", search.trim());
    if (category?.trim()) params.append("category", category.trim());
    if (numberOfSteps !== null && !isNaN(numberOfSteps)) {
      params.append("numberOfSteps", Math.max(0, parseInt(numberOfSteps)));
    }

    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach(tag => tag?.trim() && params.append("tags[]", tag.trim()));
      params.append("tagMatchType", tagMatchType === "any" ? "any" : "all");
    }

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
 */
export async function getRecipeById(id) {
  try {
    if (!id?.trim()) throw new Error("Recipe ID is required");

    const response = await fetch(`http://localhost:3000/api/recipes/${id.trim()}`, {
      next: { revalidate: 0 }, // Disable caching to always get fresh data
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error("Recipe not found");
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          `Failed to fetch recipe details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      ...data,
      _id: id, // Ensure ID is included in the response
    };
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    throw error;
  }
}

export async function updateRecipe(id, updates) {
  try {
    const response = await fetch(`http://localhost:3000/api/recipes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update recipe");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
}

/**
 * Fetches all available recipe categories
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

/**
 * Fetches reviews for a specific recipe
 */
export async function getRecipeReviews(recipeId) {
  const response = await fetch(`/api/recipes/${recipeId}/reviews`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  const data = await response.json();
  return data.reviews;
}

export async function addReview(recipeId, review) {
  const response = await fetch(`/api/recipes/${recipeId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(review),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add review');
  }

  return response.json();
}

/**
 * Updates an existing review
 */
export async function updateReview(recipeId, reviewId, review) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recipes/${recipeId}/reviews/${reviewId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(review)
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update review");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
}

/**
 * Deletes a review by ID
 */
export async function deleteReview(recipeId, reviewId) {
  try {
    const response = await fetch(
      `http://localhost:3000/api/recipes/${recipeId}/reviews/${reviewId}`,
      {
        method: "DELETE"
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete review");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
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

/**
 * Removes a recipe from favorites
 * @param {string} recipeId - The ID of the recipe to remove from favorites
 * @returns {Promise<Object>} - The removed favorite recipe object or an acknowledgment
 * @throws {Error} When the API request fails
 */
export async function removeFavorite(recipeId) {
  try {
    const response = await fetch(`${BASE_URL}/favorites/${recipeId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error(`Failed to remove favorite: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing favorite:", error);
    throw error;
  }
}
