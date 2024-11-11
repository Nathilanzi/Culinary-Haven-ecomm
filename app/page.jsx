import { Suspense } from "react";
import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories, getTags, getIngredients } from "@/lib/api";
import FilterSection from "@/components/FilterSection";
import Loader from "@/components/Loader";
import ClearFiltersButton from "@/components/ClearFiltersButton";
import RecipeCarousel from "@/components/RecipeCarousel";

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
        {total.toLocaleString()} matching {total === 1 ? "recipe" : "recipes"}
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
        {search && <span className="ml-2">(matching {search})</span>}
      </span>
    </div>
  );
}

function NoResults({ hasFilters }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">
        No recipes found
        {hasFilters && " matching the selected filters"}.
      </p>
      <ClearFiltersButton />
    </div>
  );
}

export default async function Home({ searchParams: rawSearchParams }) {
  // Wait for searchParams to be ready
  const searchParams = await Promise.resolve(rawSearchParams);

  // Parse query parameters with proper type handling
  const params = {
    page: parseInt(searchParams.page || "1", 10),
    limit: parseInt(searchParams.limit || "20", 10),
    sortBy: searchParams.sortBy || "$natural",
    order: searchParams.order || "asc",
    search: searchParams.search || "",
    category: searchParams.category || "",
    numberOfSteps: searchParams.numberOfSteps
      ? parseInt(searchParams.numberOfSteps, 10)
      : null,
    tagMatchType: searchParams.tagMatchType || "all",
    ingredientMatchType: searchParams.ingredientMatchType || "all",
  };

  // Handle array parameters
  const tags = Array.isArray(searchParams["tags[]"])
    ? searchParams["tags[]"]
    : searchParams["tags[]"]
      ? [searchParams["tags[]"]]
      : [];

  const ingredients = Array.isArray(searchParams["ingredients[]"])
    ? searchParams["ingredients[]"]
    : searchParams["ingredients[]"]
      ? [searchParams["ingredients[]"]]
      : [];

  // Fetch all data concurrently
  const [recipesData, categories, availableTags, availableIngredients] =
    await Promise.all([
      getRecipes({
        ...params,
        tags,
        ingredients,
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
    error,
  } = recipesData;

  const filters = {
    tags,
    numberOfSteps: params.numberOfSteps,
    ingredients,
    category: params.category,
    search: params.search,
  };

  const hasFilters =
    tags.length > 0 ||
    params.numberOfSteps ||
    ingredients.length > 0 ||
    params.category ||
    params.search;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg">
          <FilterSection
            categories={categories}
            initialCategory={params.category}
            initialSort={params.sortBy}
            initialOrder={params.order}
            availableTags={availableTags}
            availableIngredients={availableIngredients}
          />

          <RecipeCarousel />

          {error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
              <ClearFiltersButton />
            </div>
          ) : (
            <>
              {total > 0 && <ResultsSummary total={total} filters={filters} />}

              <Suspense fallback={<Loader />}>
                <RecipeGrid recipes={recipes} searchQuery={params.search} />
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
                <NoResults hasFilters={hasFilters} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
