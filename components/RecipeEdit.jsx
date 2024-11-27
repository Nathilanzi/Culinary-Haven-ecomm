"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * RecipeEdit component allows a user to edit the description of a recipe.
 * It displays the current recipe description, and if the user is logged in, 
 * they can edit it and save the changes.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.recipe - The recipe object containing the current recipe data.
 * @param {string} props.recipe._id - The unique identifier for the recipe.
 * @param {string} props.recipe.description - The current description of the recipe.
 * @param {Object} [props.recipe.userVersions] - The version history of the recipe description.
 * @returns {JSX.Element} The rendered component.
 */
const RecipeEdit = ({ recipe }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [description, setDescription] = useState(recipe?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Updates description state when recipe prop changes
  useEffect(() => {
    if (recipe?.description) {
      setDescription(recipe.description);
    }
  }, [recipe]);

  /**
   * Handles the form submission when updating the recipe description.
   * Validates the input and performs the update request to the API.
   * 
   * @param {React.FormEvent} event - The submit event triggered by the form.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the user is logged in
    if (!session?.user) {
      signIn();
      return;
    }

    // Check if the recipe ID exists
    if (!recipe?._id) {
      setError("Recipe ID is missing.");
      return;
    }

    // Validate the description input
    if (description.trim().length < 10) {
      setError("Description must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Send the request to update the recipe description
      const response = await fetch(`/api/recipes/${recipe._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          userId: session.user.id,
          userName: session.user.name || session.user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update recipe");
      }

      const { recipe: updatedRecipe } = await response.json();

      setSuccessMessage("Description updated successfully!");
      setIsEditing(false);

      // Update the local state with the new data
      if (updatedRecipe) {
        setDescription(updatedRecipe.description);
      }

      router.refresh(); // Refresh the server component
    } catch (error) {
      setError(error.message || "An error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the form to its initial state, canceling any unsaved changes.
   */
  const handleReset = () => {
    setDescription(recipe?.description || "");
    setError(null);
    setSuccessMessage(null);
    setIsEditing(false);
  };

  // If no recipe is provided, return null
  if (!recipe) {
    return null;
  }

  /**
   * Formats a date string into a human-readable format.
   * 
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Renders the edit history of the recipe, showing who last edited it and when.
   * 
   * @returns {JSX.Element|null} The JSX element displaying the edit history or null if no edit history exists.
   */
  const renderEditHistory = () => {
    if (!recipe.userVersions) return null;

    const latestVersion = Object.values(recipe.userVersions).sort(
      (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
    )[0];

    if (!latestVersion) return null;

    return (
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        Last edited by {latestVersion.userName} on{" "}
        {formatDate(latestVersion.lastModified)}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl shadow-sm">
      {!isEditing ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Description
            </h2>
            {session && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                Edit Description
              </button>
            )}
          </div>
          {/* ... rest of the content */}
        </div>
      ) : (
        <div>
          {/* Form buttons */}
          <div className="mt-4 flex gap-4">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
              disabled={loading || description.trim().length < 10 || !session}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sign in button */}
      {!session && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded dark:bg-yellow-900/50 dark:border-yellow-800">
          <p className="dark:text-gray-300">
            Please{" "}
            <button
              onClick={() => signIn()}
              className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              sign in
            </button>{" "}
            to edit the recipe.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeEdit;