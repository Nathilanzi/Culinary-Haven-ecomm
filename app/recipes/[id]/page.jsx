"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Gallery from "@/components/Gallery";
import Image from "next/image";

export default function RecipeDetail({ params }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params.id) {
        throw new Error('Recipe ID is required');
      }

      const response = await fetch(`/api/recipes/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Recipe not found');
        }
        throw new Error('Failed to fetch recipe details');
      }

      const data = await response.json();
      
      if (!data) {
        throw new Error('Recipe not found');
      }

      setRecipe(data);
      document.title = `${data.title} | Recipe App`;
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchRecipe();
    }
  }, [params.id]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchRecipe();
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-[400px] w-full"></div>
              <div className="p-4">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 mb-6">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Unable to Load Recipe</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                disabled={loading}
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 border border-teal-500 text-teal-500 rounded hover:bg-teal-50 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No recipe found state
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
            <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
            >
              Browse All Recipes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Title and Description */}
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-gray-700 mb-4">{recipe.description}</p>

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-4">
                {recipe.tags.map((tag, index) => (
                  <span key={index} className="bg-teal-500 text-white rounded-full px-3 py-1 text-sm mr-2">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Prep, Cook, Total Time and Servings */}
            <div className="text-sm text-gray-600 mb-4">
              {recipe.prepTime && recipe.cookTime && recipe.totalTime && recipe.servings && (
                <p>
                  Prep: {recipe.prepTime}, Cook: {recipe.cookTime}, Total: {recipe.totalTime}, Serves: {recipe.servings}
                </p>
              )}
            </div>

            {/* Nutritional Information */}
            {recipe.nutrition && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Nutritional Information:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(recipe.nutrition).map(([key, value], index) => (
                    <li key={index} className="text-gray-700">
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Main Gallery Section */}
          {recipe.images && recipe.images.length > 0 && (
            <div className="relative">
              <div className="w-full h-[400px]">
                <Gallery images={recipe.images} />
              </div>
              
              {/* Thumbnail Strip - Only show if there are multiple images */}
              {recipe.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex overflow-x-auto space-x-2 pb-2">
                    {recipe.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:opacity-80"
                      >
                        <Image
                          src={image}
                          alt={`Recipe image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Ingredients Section */}
          {recipe.ingredients && Object.keys(recipe.ingredients).length > 0 && (
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside">
                {Object.entries(recipe.ingredients).map(([ingredient, amount], index) => (
                  <li key={index} className="text-gray-700">
                    {amount} {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Instructions Section */}
          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Back Button Section */}
          <div className="p-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
