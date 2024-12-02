"use client";

import React, { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { Trash2 } from "lucide-react";

const DownloadedRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({ id: null });

  // Load recipes from localStorage
  const loadRecipes = () => {
    try {
      setLoading(true);
      // Parse recipes, ensuring we're working with parsed JSON
      const storedRecipes = JSON.parse(
        localStorage.getItem("downloadedRecipes") || "[]"
      ).map((recipe) =>
        typeof recipe === "string" ? JSON.parse(recipe) : recipe
      );

      const recipesPerPage = 6; // Number of recipes to show per page
      const startIndex = (currentPage - 1) * recipesPerPage;
      const paginatedRecipes = storedRecipes.slice(
        startIndex,
        startIndex + recipesPerPage
      );
      const totalPageCount = Math.ceil(storedRecipes.length / recipesPerPage);

      setRecipes(paginatedRecipes);
      setTotalPages(totalPageCount);

      // If no recipes, set an informative message
      if (storedRecipes.length === 0) {
        setError("No downloaded recipes found.");
      } else {
        setError("");
      }
    } catch (err) {
      setError("Error loading recipes: " + err.message);
      toast.error("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(); // Load recipes on page load and whenever currentPage changes
  }, [currentPage]);

  // Function to handle deleting a recipe
  const handleDelete = (recipeId) => {
    try {
      // Retrieve and parse stored recipes
      const storedRecipes = JSON.parse(
        localStorage.getItem("downloadedRecipes") || "[]"
      ).map((recipe) =>
        typeof recipe === "string" ? JSON.parse(recipe) : recipe
      );

      // Filter out the recipe to delete
      const updatedRecipes = storedRecipes.filter(
        (recipe) => recipe.id !== recipeId
      );

      // Save updated recipes back to localStorage
      localStorage.setItem("downloadedRecipes", JSON.stringify(updatedRecipes));

      // Reload recipes and show toast
      loadRecipes();
      toast.success("Recipe deleted successfully");
      
      // Reset delete confirmation
      setDeleteConfirmation({ id: null });
    } catch (err) {
      setError("Error deleting recipe: " + err.message);
      toast.error("Failed to delete recipe");
    }
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="max-w-6xl mx-auto container px-4 py-8 min-h-screen">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <h1 className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        My Downloaded Recipes
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading recipes...</p>
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {recipes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>You have no downloaded recipes.</p>
              <p className="mt-2">Start exploring and download some recipes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard recipe={recipe} />
                  {deleteConfirmation.id === recipe.id ? (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-100 border border-red-300 rounded-lg p-2 z-10 shadow-lg">
                      <div className="flex items-center space-x-2">
                        <p className="text-red-700 text-sm">Delete?</p>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          className="bg-red-500 text-white rounded-full px-2 py-1 text-xs hover:bg-red-600 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({ id: null })}
                          className="bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmation({ id: recipe.id })}
                      className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {recipes.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DownloadedRecipesPage;