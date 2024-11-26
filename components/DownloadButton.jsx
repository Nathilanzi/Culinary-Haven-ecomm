"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DownloadButton({ recipe }) {
  const handleDownload = () => {
    // Add early validation
    if (!recipe) {
      toast.error("No recipe data available");
      return;
    }

    try {
      // Ensure the recipe has a unique identifier
      const recipeToSave = { 
        ...recipe, 
        id: recipe.id || Date.now().toString() 
      };

      // Get existing recipes from localStorage or initialize an empty array
      const downloadedRecipes = 
        JSON.parse(localStorage.getItem("downloadedRecipes") || "[]");

      // Check if the recipe is already downloaded
      const isAlreadyDownloaded = downloadedRecipes.some(
        (savedRecipe) => {
          const parsedRecipe = JSON.parse(savedRecipe);
          return parsedRecipe.id === recipeToSave.id;
        }
      );

      if (isAlreadyDownloaded) {
        toast.warning("Recipe already saved!");
        return;
      }

      // Add the new recipe to the list
      downloadedRecipes.push(JSON.stringify(recipeToSave));

      // Save the updated list back to localStorage
      localStorage.setItem("downloadedRecipes", JSON.stringify(downloadedRecipes));

      // Show success notification
      toast.success("Recipe saved successfully!");

    } catch (error) {
      // Handle any potential errors
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition-colors duration-300"
    >
      <DownloadIcon className="w-5 h-5" />
      Save Recipe
    </button>
  );
}