import RecipeGrid from "@/components/RecipeGrid";
import Pagination from "@/components/Pagination";
import { getRecipes } from "@/lib/api";

export default async function Home({ searchParams }) {
  const page = Number(searchParams?.page) || 1;

  const { recipes, totalPages } = await getRecipes(page, 20);

  return (
    <div className="min-h-screen bg-gray-50">
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
