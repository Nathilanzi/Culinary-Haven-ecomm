"use client";

import { DownloadIcon, CheckIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

/**
 * Represents a recipe object with download and version information.
 * @typedef {Object} Recipe
 * @property {string} id - Unique identifier for the recipe
 * @property {string} [version] - Version of the recipe
 * @property {string} [downloadedAt] - Timestamp of download
 */

/**
 * A button component for downloading and saving recipes to local storage
 * @component
 * @param {Object} props - Component properties
 * @param {Recipe} props.recipe - The recipe to be downloaded
 * @returns {JSX.Element|null} Download button or null if no recipe is provided
 */
export default function DownloadButton({ recipe }) {
  /**
   * Tracks whether the recipe has been downloaded
   * @type {[boolean, function]}
   */
  const [isDownloaded, setIsDownloaded] = useState(false);

  /**
   * Tracks the syncing state during download process
   * @type {[boolean, function]}
   */
  const [isSyncing, setIsSyncing] = useState(false);

  /**
   * Check for existing downloaded recipes on component mount
   */
  useEffect(() => {
    if (recipe) {
      const downloadedRecipes = JSON.parse(
        localStorage.getItem("downloadedRecipes") || "[]"
      )
        .map((r) => (typeof r === "string" ? JSON.parse(r) : r)) // Parse strings into objects if needed
        .filter((r) => r && r.id); // Ensure each object is valid and has an `id`
  
      const existingRecipe = downloadedRecipes.find(
        (savedRecipe) => savedRecipe.id === recipe.id
      );
  
      setIsDownloaded(!!existingRecipe);
    }
  }, [recipe]);

  /**
   * Handles the recipe download process
   * - Validates recipe data
   * - Manages local storage of downloaded recipes
   * - Provides user feedback via toast notifications
   * @async
   */
  const handleDownload = async () => {
    if (!recipe || !recipe.id) {
      toast.error("Invalid recipe data");
      return;
    }
  
    setIsSyncing(true);
  
    try {
      const recipeToSave = {
        ...recipe,
        id: recipe.id,
        downloadedAt: new Date().toISOString(),
        version: recipe.version || "1.0",
      };
  
      const downloadedRecipes = JSON.parse(
        localStorage.getItem("downloadedRecipes") || "[]"
      )
        .map((r) => (typeof r === "string" ? JSON.parse(r) : r))
        .filter((r) => r && r.id); // Filter out invalid entries
  
      const existingRecipeIndex = downloadedRecipes.findIndex(
        (savedRecipe) => savedRecipe.id === recipeToSave.id
      );
  
      if (existingRecipeIndex !== -1) {
        if (
          downloadedRecipes[existingRecipeIndex].version !== recipeToSave.version
        ) {
          downloadedRecipes[existingRecipeIndex] = recipeToSave;
          toast.info("Recipe updated to the latest version.");
        } else {
          toast.warning("Recipe already downloaded.");
          setIsSyncing(false);
          return;
        }
      } else {
        downloadedRecipes.push(recipeToSave);
        toast.success("Recipe downloaded successfully!");
      }
  
      localStorage.setItem(
        "downloadedRecipes",
        JSON.stringify(downloadedRecipes)
      );
  
      setIsDownloaded(true);
      window.dispatchEvent(new Event("recipesDownloaded"));
    } catch (error) {
      console.error("Error saving recipe:", error);
      toast.error("Failed to save recipe.");
    } finally {
      setIsSyncing(false);
    }
  };
  

  // Don't render if no recipe is provided
  if (!recipe) return null;

  return (
    <button
      onClick={handleDownload}
      className="relative bg-[#f5f5dcb2] hover:bg-[#F5F5DC] rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out group"
      disabled={isSyncing}
      title={isDownloaded ? "Recipe Downloaded" : "Download Recipe"}
    >
      {isSyncing ? (
        <CheckIcon className="w-6 h-6 text-teal-600 animate-pulse" />
      ) : (
        <DownloadIcon className="w-6 h-6 text-[#DB8C28] group-hover:text-[#0C3B2E] dark:text-teal-700 dark:group-hover:text-teal-500 transition-colors" />
      )}
      {isDownloaded && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-800 rounded-full animate-ping"></span>
      )}
    </button>
  );
}
