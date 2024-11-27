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
      className= " absolute top-6 right-8"
    >
      <DownloadIcon className="w-[40%] px-4 ml-[119px] block text-center bg-[#DB8C28] text-white font-semibold py-2 rounded-full shadow hover:bg-[#0C3B2E] transition-colors mt-[62px] dark:bg-teal-700" />
    </button>
  );
}