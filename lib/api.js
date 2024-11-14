// Cache implementation
const cache = new Map();

const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  CATEGORIES_TTL: 60 * 60 * 1000, // 1 hour
  TAGS_TTL: 60 * 60 * 1000, // 1 hour
  INGREDIENTS_TTL: 60 * 60 * 1000, // 1 hour
};

class CacheManager {
  static set(key, data, ttl = CACHE_CONFIG.DEFAULT_TTL) {
    cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  static get(key) {
    const cached = cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static generateKey(endpoint, params = {}) {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  static clear() {
    cache.clear();
  }
}

const API_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
  SORT_ORDERS: ['asc', 'desc'],
  DEFAULT_SORT: '$natural',
  DEFAULT_ORDER: 'asc'
};

const sanitizePaginationParams = (page, limit) => ({
  page: Math.max(API_CONSTANTS.DEFAULT_PAGE, Number(page) || API_CONSTANTS.DEFAULT_PAGE),
  limit: Math.min(
    Math.max(API_CONSTANTS.MIN_LIMIT, Number(limit) || API_CONSTANTS.DEFAULT_LIMIT),
    API_CONSTANTS.MAX_LIMIT
  )
});

const sanitizeSortParams = (sortBy, order) => ({
  sortBy: sortBy || API_CONSTANTS.DEFAULT_SORT,
  order: API_CONSTANTS.SORT_ORDERS.includes(order?.toLowerCase())
    ? order.toLowerCase()
    : API_CONSTANTS.DEFAULT_ORDER
});

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
  skipCache = false,
}) {
  const params = {
    page,
    limit,
    search,
    sortBy,
    order,
    category,
    tags,
    tagMatchType,
    ingredients,
    ingredientsMatchType,
    numberOfSteps,
  };

  const cacheKey = CacheManager.generateKey('recipes', params);
  
  if (!skipCache) {
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const { page: validPage, limit: validLimit } = sanitizePaginationParams(page, limit);
    const { sortBy: validSortBy, order: validOrder } = sanitizeSortParams(sortBy, order);

    const urlParams = new URLSearchParams({
      page: validPage.toString(),
      limit: validLimit.toString(),
      sortBy: validSortBy,
      order: validOrder,
    });

    if (search?.trim()) urlParams.append("search", search.trim());
    if (category?.trim()) urlParams.append("category", category.trim());
    if (numberOfSteps !== null && !isNaN(numberOfSteps)) {
      urlParams.append("numberOfSteps", Math.max(0, parseInt(numberOfSteps)));
    }

    if (Array.isArray(tags) && tags.length > 0) {
      tags.forEach(tag => tag?.trim() && urlParams.append("tags[]", tag.trim()));
      urlParams.append("tagMatchType", tagMatchType === "any" ? "any" : "all");
    }

    if (Array.isArray(ingredients) && ingredients.length > 0) {
      ingredients.forEach(ingredient => 
        ingredient?.trim() && urlParams.append("ingredients[]", ingredient.trim())
      );
      urlParams.append("ingredientsMatchType", ingredientsMatchType === "any" ? "any" : "all");
    }

    const response = await fetch(`http://localhost:3000/api/recipes?${urlParams}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const result = {
      recipes: data.recipes || [],
      total: data.total || 0,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / validLimit),
      currentPage: validPage,
      limit: validLimit,
      hasNextPage: validPage < (data.totalPages || Math.ceil((data.total || 0) / validLimit)),
      hasPreviousPage: validPage > 1
    };

    CacheManager.set(cacheKey, result);
    return result;
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

export async function getRecipeById(id, skipCache = false) {
  try {
    if (!id?.trim()) throw new Error("Recipe ID is required");

    const cacheKey = CacheManager.generateKey('recipe', { id });
    
    if (!skipCache) {
      const cachedData = CacheManager.get(cacheKey);
      if (cachedData) return cachedData;
    }

    const response = await fetch(`http://localhost:3000/api/recipes/${id.trim()}`, {
      next: { revalidate: 0 },
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
    const result = {
      ...data,
      _id: id,
    };

    CacheManager.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching recipe by ID:", error);
    throw error;
  }
}

export async function getCategories(skipCache = false) {
  const cacheKey = CacheManager.generateKey('categories');
  
  if (!skipCache) {
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const response = await fetch("http://localhost:3000/api/categories");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const categories = await response.json();
    const result = Array.isArray(categories) ? categories : [];
    
    CacheManager.set(cacheKey, result, CACHE_CONFIG.CATEGORIES_TTL);
    return result;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getTags(skipCache = false) {
  const cacheKey = CacheManager.generateKey('tags');
  
  if (!skipCache) {
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const response = await fetch("http://localhost:3000/api/tags");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
    }

    const tags = await response.json();
    const result = Array.isArray(tags) ? tags : [];
    
    CacheManager.set(cacheKey, result, CACHE_CONFIG.TAGS_TTL);
    return result;
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

export async function getIngredients(skipCache = false) {
  const cacheKey = CacheManager.generateKey('ingredients');
  
  if (!skipCache) {
    const cachedData = CacheManager.get(cacheKey);
    if (cachedData) return cachedData;
  }

  try {
    const response = await fetch("http://localhost:3000/api/ingredients");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ingredients: ${response.status} ${response.statusText}`);
    }

    const ingredients = await response.json();
    const result = Array.isArray(ingredients) ? ingredients : [];
    
    CacheManager.set(cacheKey, result, CACHE_CONFIG.INGREDIENTS_TTL);
    return result;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return [];
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

    // Invalidate relevant cache entries
    const recipeKey = CacheManager.generateKey('recipe', { id });
    cache.delete(recipeKey);
    // Also delete any cached recipe lists since they might include this recipe
    for (const key of cache.keys()) {
      if (key.startsWith('recipes:')) {
        cache.delete(key);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
}

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

export { CacheManager };