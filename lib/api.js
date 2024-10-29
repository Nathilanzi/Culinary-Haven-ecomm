const cache = {
  recipes: new Map(),
  categories: null,
  recipesList: new Map(),
  timeouts: new Map(),
};

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Generates a cache key for recipes list based on all query parameters
 * @param {Object} params - Query parameters
 * @returns {string} Cache key
 */
const CACHE_KEY_RECIPES_LIST = (params) => {
  const { page, limit, search } = params;
  return `{recipes_${page}_${limit}|| ""}_${search || ""}`;
};

/**
 * Clears cache entry after specified duration
 * @param {string} key - Cache key to clear
 * @param {string} type - Cache type ('recipes' or 'recipesList')
 */
function setCacheTimeout(key, type) {
  // Clear any existing timeout
  if (cache.timeouts.has(key)) {
    clearTimeout(cache.timeouts.get(key));
  }

  // Set new timeout
  const timeout = setTimeout(() => {
    if (type === "recipes") {
      cache.recipes.delete(key);
    } else if (type === "recipesList") {
      cache.recipesList.delete(key);
    }
    cache.timeouts.delete(key);
  }, CACHE_DURATION);

  cache.timeouts.set(key, timeout);
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

  // Check cache first
  if (cache.recipes.has(id)) {
    return cache.recipes.get(id);
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

    cache.recipes.set(id, recipe);
    setCacheTimeout(id, "recipes");

    return recipe;
  } catch (error) {
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
}

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
 * Fetches all available recipe categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  // Check cache first
  if (cache.categories) {
    return cache.categories;
  }

  try {
    const response = await fetch("http://localhost:3000/api/categories");

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();

    cache.categories = categories;

    setTimeout(() => {
      cache.categories = null;
    }, CACHE_DURATION);

    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${error.message}`);
  }
}

/**
 * Manually clears the entire cache
 */
export function clearCache() {
  cache.recipes.clear();
  cache.recipesList.clear();
  cache.categories = null;

  // Clear all timeouts
  for (const timeout of cache.timeouts.values()) {
    clearTimeout(timeout);
  }
  cache.timeouts.clear();
}

/**
 * Manually removes a specific recipe from the cache
 * @param {string} id - Recipe ID to remove from cache
 */
export function invalidateRecipe(id) {
  cache.recipes.delete(id);
  if (cache.timeouts.has(id)) {
    clearTimeout(cache.timeouts.get(id));
    cache.timeouts.delete(id);
  }
}

/**
 * Manually removes recipes list from cache based on query parameters
 * @param {Object} params - Query parameters used to generate the cache key
 */
export function invalidateRecipesList(params) {
  const cacheKey = CACHE_KEY_RECIPES_LIST(params);
  cache.recipesList.delete(cacheKey);
  if (cache.timeouts.has(cacheKey)) {
    clearTimeout(cache.timeouts.get(cacheKey));
    cache.timeouts.delete(cacheKey);
  }
}
