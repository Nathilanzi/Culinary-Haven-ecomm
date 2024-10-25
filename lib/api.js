// Simple in-memory cache implementation
const cache = {
  recipes: new Map(),
  categories: null,
  recipesList: new Map(),
  timeouts: new Map(),
};

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_KEY_RECIPES_LIST = (page, limit) => `recipes_${page}_${limit}`;

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
    if (type === 'recipes') {
      cache.recipes.delete(key);
    } else if (type === 'recipesList') {
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
    // API call to fetch the recipe by ID
    const response = await fetch(`http://localhost:3000/api/recipes/${id}`);

    // Check if the request was successful
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Recipe not found");
      }
      throw new Error("Failed to fetch recipe details");
    }

    // Parse the recipe data
    const recipe = await response.json();
    
    // Store in cache
    cache.recipes.set(id, recipe);
    setCacheTimeout(id, 'recipes');

    return recipe;
  } catch (error) {
    // Handle and rethrow any errors that occur during the fetch
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
}

/**
 * Fetches recipes with pagination
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Object containing recipes array and pagination info
 */
export async function getRecipes(page = 1, limit = 20) {
  const cacheKey = CACHE_KEY_RECIPES_LIST(page, limit);

  // Check cache first
  if (cache.recipesList.has(cacheKey)) {
    return cache.recipesList.get(cacheKey);
  }

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    
    // Store in cache
    cache.recipesList.set(cacheKey, data);
    setCacheTimeout(cacheKey, 'recipesList');

    return data;
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
  // Check cache first
  if (cache.categories) {
    return cache.categories;
  }

  try {
    // Make API request to fetch categories
    const response = await fetch("/api/categories");

    // Check if the request was successful
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    // Parse the response data
    const categories = await response.json();
    
    // Store in cache
    cache.categories = categories;

    // Categories are relatively static, but we'll still clear the cache after the duration
    setTimeout(() => {
      cache.categories = null;
    }, CACHE_DURATION);

    return categories;
  } catch (error) {
    // Handle and rethrow any errors that occur during the fetch
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
 * Manually removes a specific recipes list from the cache
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 */
export function invalidateRecipesList(page, limit) {
  const cacheKey = CACHE_KEY_RECIPES_LIST(page, limit);
  cache.recipesList.delete(cacheKey);
  if (cache.timeouts.has(cacheKey)) {
    clearTimeout(cache.timeouts.get(cacheKey));
    cache.timeouts.delete(cacheKey);
  }
}