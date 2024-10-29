const cache = {
  recipes: new Map(),
  categories: null,
  tags: null,
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
  const { page, limit, search, category, tags, tagMatchType } = params;
  return `recipes_${page}_${limit}_${search || ""}_${category || ""}_${tags.join(",")}_${tagMatchType}`;
};

/**
 * Clears cache entry after specified duration
 * @param {string} key - Cache key to clear
 * @param {string} type - Cache type ('recipes', 'recipesList', 'categories', or 'tags')
 */
function setCacheTimeout(key, type) {
  if (cache.timeouts.has(key)) {
    clearTimeout(cache.timeouts.get(key));
  }

  const timeout = setTimeout(() => {
    if (type === "recipes") cache.recipes.delete(key);
    else if (type === "recipesList") cache.recipesList.delete(key);
    else if (type === "categories") cache.categories = null;
    else if (type === "tags") cache.tags = null;

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
  if (!id) throw new Error("Recipe ID is required");

  if (cache.recipes.has(id)) return cache.recipes.get(id);

  try {
    const response = await fetch(`http://localhost:3000/api/recipes/${id}`);
    if (!response.ok) throw new Error("Failed to fetch recipe details");

    const recipe = await response.json();
    cache.recipes.set(id, recipe);
    setCacheTimeout(id, "recipes");

    return recipe;
  } catch (error) {
    throw new Error(`Error fetching recipe: ${error.message}`);
  }
}

/**
 * Fetches recipes with pagination, filtering, sorting, search, and tag matching
 * @param {Object} params - Query parameters for filtering, sorting, and pagination
 * @returns {Promise<Object>} - Object containing recipes array and pagination info
 */
export async function getRecipes({
  page = 1,
  limit = 20,
  search = "",
  sortBy = "title",
  order = "asc",
  category = "",
  tags = [],
  tagMatchType = "all",
}) {
  const cacheKey = CACHE_KEY_RECIPES_LIST({ page, limit, search, category, tags, tagMatchType });

  if (cache.recipesList.has(cacheKey)) return cache.recipesList.get(cacheKey);

  try {
    const params = new URLSearchParams({ page, limit, sortBy, order });
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (tags.length > 0) {
      tags.forEach(tag => params.append("tags[]", tag));
      params.append("tagMatchType", tagMatchType);
    }

    const response = await fetch(`http://localhost:3000/api/recipes?${params}`);
    if (!response.ok) throw new Error("Failed to fetch recipes");

    const data = await response.json();
    cache.recipesList.set(cacheKey, data);
    setCacheTimeout(cacheKey, "recipesList");

    return data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { recipes: [], total: 0, totalPages: 0 };
  }
}

/**
 * Fetches all available recipe categories
 * @returns {Promise<Array>} Array of category objects
 */
export async function getCategories() {
  if (cache.categories) return cache.categories;

  try {
    const response = await fetch("http://localhost:3000/api/categories");
    if (!response.ok) throw new Error("Failed to fetch categories");

    const categories = await response.json();
    cache.categories = categories;
    setCacheTimeout("categories", "categories");

    return categories;
  } catch (error) {
    console.error(`Error fetching categories: ${error.message}`);
    return [];
  }
}

/**
 * Fetches all available recipe tags
 * @returns {Promise<Array>} Array of tag objects
 */
export async function getTags() {
  if (cache.tags) return cache.tags;

  try {
    const response = await fetch("http://localhost:3000/api/tags");
    if (!response.ok) throw new Error("Failed to fetch tags");

    const tags = await response.json();
    cache.tags = tags;
    setCacheTimeout("tags", "tags");

    return tags;
  } catch (error) {
    console.error(`Error fetching tags: ${error.message}`);
    return [];
  }
}

/**
 * Manually clears the entire cache
 */
export function clearCache() {
  cache.recipes.clear();
  cache.recipesList.clear();
  cache.categories = null;
  cache.tags = null;

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
