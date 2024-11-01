import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories, getTags, getIngredients } from "@/lib/api";
import FilterSection from "@/components/FilterSection";

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

export default async function Home({ searchParams }) {
  // Extract all parameters
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const sortBy = searchParams?.sortBy || "$natural";
  const order = searchParams?.order || "asc";
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";
  const numberOfSteps = searchParams?.numberOfSteps || null;

  // Handle tags properly - ensure it's always an array
  let tags = [];
  if (searchParams?.["tags[]"]) {
    tags = Array.isArray(searchParams["tags[]"])
      ? searchParams["tags[]"]
      : [searchParams["tags[]"]];
  }

  let ingredients = [];
  if (searchParams?.["ingredients[]"]) {
    ingredients = Array.isArray(searchParams["ingredients[]"])
      ? searchParams["ingredients[]"]
      : [searchParams["ingredients[]"]];
  }

  const tagMatchType = searchParams?.tagMatchType || "all";
  const ingredientMatchType = searchParams?.ingredientMatchType || "all";

  // Fetch all data concurrently
  const [recipesData, categories, availableTags, availableIngredients] = await Promise.all([
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

  const { recipes, total, totalPages } = recipesData;

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

          {total > 0 && (
            <div className="mb-4 text-gray-600">
              Found {total} matching recipes
              {tags.length > 0 && (
                <span className="ml-2">
                  (filtered by {tags.length}
                  {tags.length === 1 ? " tag" : " tags"})
                </span>
              )}
              {numberOfSteps && (
                <span className="ml-2">(with {numberOfSteps} steps)</span>
              )}
              {ingredients.length > 0 && (
                <span className="ml-2">
                  (filtered by {ingredients.length}
                  {ingredients.length === 1 ? " ingredient" : " ingredients"})
                </span>
              )}
            </div>
          )}

          <RecipeGrid recipes={recipes} searchQuery={search} />

          {recipes.length > 0 ? (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} />
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
                  const params = new URLSearchParams(searchParams);
                  params.delete("tags[]");
                  params.delete("tagMatchType");
                  params.delete("numberOfSteps");
                  params.delete("ingredients[]");
                  params.delete("ingredientsMatchType")
                  window.location.href = `?${params.toString()}`;
                }}
                className="mt-4 text-blue-500 hover:text-blue-700 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}