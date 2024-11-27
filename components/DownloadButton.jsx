"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function DownloadButton({ recipe }) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    // Check if the recipe is already downloaded when component mounts
    if (recipe) {
      const downloadedRecipes = 
        JSON.parse(localStorage.getItem("downloadedRecipes") || "[]")
          .map(r => typeof r === 'string' ? JSON.parse(r) : r);
      
      const existingRecipe = downloadedRecipes.find(
        (savedRecipe) => savedRecipe.id === recipe.id
      );

      setIsDownloaded(!!existingRecipe);
    }
  }, [recipe]);

  const handleDownload = async () => {
    // Add early validation
    if (!recipe) {
      toast.error("No recipe data available");
      return;
    }

    try {
      // Ensure the recipe has a unique identifier
      const recipeToSave = { 
        ...recipe, 
        id: recipe.id || Date.now().toString(),
        downloadedAt: new Date().toISOString(),
        version: recipe.version || '1.0'
      };

      // Get existing recipes from localStorage or initialize an empty array
      const downloadedRecipes = 
        JSON.parse(localStorage.getItem("downloadedRecipes") || "[]")
          .map(r => typeof r === 'string' ? JSON.parse(r) : r);

      // Check if the recipe is already downloaded
      const existingRecipeIndex = downloadedRecipes.findIndex(
        (savedRecipe) => savedRecipe.id === recipeToSave.id
      );

      if (existingRecipeIndex !== -1) {
        // Update existing recipe if versions differ
        if (downloadedRecipes[existingRecipeIndex].version !== recipeToSave.version) {
          downloadedRecipes[existingRecipeIndex] = recipeToSave;
          toast.info("Recipe updated to latest version");
        } else {
        toast.warning("Recipe already saved!");
        return;
        }
      } else {
        // Add the new recipe to the list
        downloadedRecipes.push(recipeToSave);
        toast.success("Recipe saved successfully!");
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