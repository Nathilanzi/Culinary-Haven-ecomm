import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes } from "@/lib/api";

export const metadata = {
  title: "Browse All Recipes",
  description: "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  openGraph: {
    title: "Browse All Recipes | Culinary Haven",
    description: "Browse through our collection of delicious recipes. Find everything from quick weeknight dinners to gourmet dishes.",
  }
};

export default async function Home({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const { recipes, totalPages } = await getRecipes(page, 20);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <RecipeGrid recipes={recipes} />
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
  );
}
