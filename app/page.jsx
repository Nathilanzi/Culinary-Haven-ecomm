import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes, getCategories } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";

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
  const sortBy = searchParams?.sortBy || "title";
const order = searchParams?.order || "asc";
  const search = searchParams?.search || ""; 
  const category = searchParams?.category || "";

  // Fetch recipes
  const { recipes, totalPages } = await getRecipes({
    page,
    limit,
    search,
    sortBy, 
    order,
    category
  });

  const categories = await getCategories();

  return (
    <div>
      <div className="pt-3">{/* <HeroSection /> */}</div>
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8">
          <div>
            <CategoryFilter currentCategory={category}categories={categories}/>
          </div>
          <RecipeGrid recipes={recipes} searchQuery={search} /> {/* Pass searchQuery here */}

        </div>

        {recipes.length > 0 ? (
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              preserveParams={true}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
