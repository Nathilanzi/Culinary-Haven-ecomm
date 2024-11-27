"use client";

import React, { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

const DownloadedRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load recipes from localStorage
  const loadRecipes = () => {
    try {
      setLoading(true);
      // Parse recipes, ensuring we're working with parsed JSON
      const storedRecipes = JSON.parse(localStorage.getItem("downloadedRecipes") || "[]")
        .map(recipe => typeof recipe === 'string' ? JSON.parse(recipe) : recipe);

      const recipesPerPage = 6; // Number of recipes to show per page
      const startIndex = (currentPage - 1) * recipesPerPage;
      const paginatedRecipes = storedRecipes.slice(startIndex, startIndex + recipesPerPage);
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
      const storedRecipes = JSON.parse(localStorage.getItem("downloadedRecipes") || "[]")
        .map(recipe => typeof recipe === 'string' ? JSON.parse(recipe) : recipe);

      // Filter out the recipe to delete
      const updatedRecipes = storedRecipes.filter((recipe) => recipe.id !== recipeId);

      // Save updated recipes back to localStorage
      localStorage.setItem("downloadedRecipes", JSON.stringify(updatedRecipes));
      
      // Reload recipes and show toast
      loadRecipes();
      toast.success("Recipe deleted successfully");
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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Downloaded Recipes</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading recipes...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
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
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Delete
                  </button>
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