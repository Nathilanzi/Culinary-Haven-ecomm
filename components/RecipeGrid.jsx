"use client";

import { useState, useEffect } from "react";
import { getRecipes } from "@/lib/api";
import RecipeCard from "./RecipeCard";
import { Pagination } from "./pagination";

export default function RecipeGrid() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    sort: "",
    search: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesData] = await Promise.all([
        getRecipes({
          page: currentPage,
          limit: 20,
          ...filters,
        }),
      ]);

      setRecipes(recipesData.recipes);
      setTotalPages(recipesData.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filters]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>

              {recipes.length > 0 ? (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLastPage={currentPage >= totalPages}
                />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No recipes found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}