"use client";

import { getRecipeById } from "../../../lib/api";
import ImageSelector from "../../../components/ImageSelector.jsx";
import BackButton from "../../../components/BackButton"; 

export default async function RecipeDetail({ params }) {
  const { id } = params;

    // Fetch the recipe on the server side
  let recipe;
  try {
    recipe = await getRecipeById(id);
  } catch (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-teal-500 text-white rounded mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-700">Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-white text-black min-h-screen">
      <div className="p-6 sm:p-8 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          
          {/* Image Gallery Section */}
          <div className="md:col-span-2 lg:col-span-3">
            <ImageSelector images={recipe.images} />
          </div>

          {/* Recipe Details Section */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-center lg:text-left">{recipe.title}</h2>
            <p className="text-gray-700">{recipe.description}</p>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold">Ingredients</h3>
              <ul className="list-disc list-inside space-y-2 mt-2 text-gray-700">
                {Object.entries(recipe.ingredients).map(([ingredient, amount], index) => (
                  <li key={index}>{amount} {ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2 text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold">Tags:</h3>
                <div className="space-x-2">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="inline-block bg-gray-200 text-gray-600 rounded px-2 py-1">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back Button */}
            <BackButton />
          </div>
        </div>
      </div>
    </div>
  );
}
