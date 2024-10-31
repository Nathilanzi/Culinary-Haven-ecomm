import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories, getTags } from "@/lib/api";
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
  // Extract all parameters including tags
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const sortBy = searchParams?.sortBy || "$natural";
  const order = searchParams?.order || "asc";
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";

  // Handle tags properly - ensure it's always an array
  let tags = [];
  if (searchParams?.["tags[]"]) {
    tags = Array.isArray(searchParams["tags[]"])
      ? searchParams["tags[]"]
      : [searchParams["tags[]"]];
  }

  const tagMatchType = searchParams?.tagMatchType || "all";

  // Fetch all data concurrently
  const [recipesData, categories, availableTags] = await Promise.all([
    getRecipes({
      page,
      limit,
      search,
      sortBy,
      order,
      category,
      tags,
      tagMatchType,
    }),
    getCategories(),
    getTags(),
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
                {search && " for this search query"}.
              </p>
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete("tags[]");
                  params.delete("tagMatchType");
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
