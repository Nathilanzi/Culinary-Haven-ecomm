import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import SortOrder from "@/components/SortOrder";
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
  // Extract all query parameters with defaults
  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 20;
  const sortBy = searchParams?.sortBy || "$natural";
  const order = searchParams?.order || "asc";
  const search = searchParams?.search || "";
  const category = searchParams?.category || "";

  // Fetch recipes
  const { recipes, total, totalPages } = await getRecipes({
    page,
    limit,
    search,
    sortBy,
    order,
    category,
  });

  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      {/* <HeroSection /> */}
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg">
            <FilterSection
              currentCategory={category}
              categories={categories}
              currentSort={sortBy}
              currentOrder={order}
            />
          {total > 0 && (
            <div className="mb-4 text-gray-600">
              Found {total} matching recipes
            </div>
          )}

          <RecipeGrid recipes={recipes} searchQuery={search} />

          {recipes.length > 0 ? (
            <div className="mt-8">
              <Pagination currentPage={page} totalPages={totalPages} />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No recipes found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
