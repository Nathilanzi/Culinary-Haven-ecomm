import { Suspense } from 'react';
import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories, getTags, getIngredients } from "@/lib/api";
import FilterSection from "@/components/FilterSection";
import Loader from "@/components/Loader";

export const metadata = {
  title: "Culinary Haven: Online Recipes | SA's leading online recipe app",
  description:
    "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  openGraph: {
    title: "Culinary Haven: Online Recipes | SA's leading online recipe app",
    description:
      "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  },
};

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

function ResultsSummary({ total, filters }) {
  const { tags, numberOfSteps, ingredients, category, search } = filters;
  
  return (
    <div className="flex items-center gap-2 mt-4 text-gray-600 font-medium">
      <SearchIcon className="w-4 h-4" />
      <span>
        {total.toLocaleString()} matching {total === 1 ? 'recipe' : 'recipes'}
        {tags?.length > 0 && (
          <span className="ml-2">
            (filtered by {tags.length}
            {tags.length === 1 ? " tag" : " tags"})
          </span>
        )}
        {numberOfSteps && (
          <span className="ml-2">(with {numberOfSteps} steps)</span>
        )}
        {ingredients?.length > 0 && (
          <span className="ml-2">
            (filtered by {ingredients.length}
            {ingredients.length === 1 ? " ingredient" : " ingredients"})
          </span>
        )}
        {category && <span className="ml-2">(in {category})</span>}
        {search && <span className="ml-2">(matching "{search}")</span>}
      </span>
    </div>
  );
}

export default async function Home({ searchParams }) {
  // Extract and sanitize query parameters
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const sortBy = searchParams?.sortBy || "$natural";
  const order = searchParams?.order || "asc";
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const numberOfSteps = searchParams?.numberOfSteps || null;

  // Handle array parameters
  const tags = searchParams?.["tags[]"]
    ? Array.isArray(searchParams["tags[]"])
      ? searchParams["tags[]"]
      : [searchParams["tags[]"]]
    : [];

  const ingredients = searchParams?.["ingredients[]"]
    ? Array.isArray(searchParams["ingredients[]"])
      ? searchParams["ingredients[]"]
      : [searchParams["ingredients[]"]]
    : [];

  const tagMatchType = searchParams?.tagMatchType || "all";
  const ingredientMatchType = searchParams?.ingredientMatchType || "all";

  // Fetch all data concurrently
  const [recipesData, categories, availableTags, availableIngredients] =
    await Promise.all([
      getRecipes({
        page,
        limit,
        search,
        sortBy,
        order,
        category,
        tags,
        tagMatchType,
        ingredients,
        ingredientMatchType,
        numberOfSteps,
      }),
      getCategories(),
      getTags(),
      getIngredients(),
    ]);

  const {
    recipes,
    total,
    totalPages,
    currentPage,
    limit: resultLimit,
    error
  } = recipesData;

  const filters = {
    tags,
    numberOfSteps,
    ingredients,
    category,
    search
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg">
          <FilterSection
            categories={categories}
            initialCategory={category}
            initialSort={sortBy}
            initialOrder={order}
            availableTags={availableTags}
            availableIngredients={availableIngredients}
          />

          {error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-blue-500 hover:text-blue-700 underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {total > 0 && <ResultsSummary total={total} filters={filters} />}

              <Suspense fallback={<Loader />}>
                <RecipeGrid recipes={recipes} searchQuery={search} />
              </Suspense>

              {recipes.length > 0 ? (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalResults={total}
                    resultsPerPage={resultLimit}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No recipes found
                    {tags.length > 0 && " matching the selected tags"}
                    {category && " in this category"}
                    {search && " for this search query"}
                    {numberOfSteps && ` with ${numberOfSteps} steps`}
                    {ingredients.length > 0 && " matching the selected ingredients"}.
                  </p>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams();
                      params.set("page", "1");
                      window.location.href = `?${params.toString()}`;
                    }}
                    className="mt-4 text-blue-500 hover:text-blue-700 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}