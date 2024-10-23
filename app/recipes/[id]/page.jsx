"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";

export default function RecipeDetail({ params }) {
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!params.id) {
        throw new Error("Recipe ID is required");
      }

      const response = await fetch(`/api/recipes/${params.id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Recipe not found");
        }
        throw new Error("Failed to fetch recipe details");
      }

      const data = await response.json();

      if (!data) {
        throw new Error("Recipe not found");
      }

      setRecipe(data);
      setCurrentImage(data.images ? data.images[0] : null);
      document.title = `${data.title} | Recipe App`;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching recipe:", err);
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
    fetchRecipe();
  };

  const handleError = (e) => {
    e.target.src = recipe.thumbnail;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
        <button onClick={handleRetry} className="px-4 py-2 bg-teal-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <p>Recipe not found</p>
      </div>
    );
  }

  const discountedPrice = recipe.discountPercentage
    ? (recipe.price - (recipe.price * recipe.discountPercentage) / 100).toFixed(2)
    : recipe.price;

  return (
    <div className="font-sans bg-white text-black">
      <div className="p-4 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Image Gallery Section */}
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            <div className="bg-gray-200 px-4 py-12 rounded-xl">
              <img
                src={currentImage}
                alt="Recipe"
                onError={handleError}
                className="w-9/12 rounded object-cover mx-auto"
              />
            </div>

            {recipe.images.length > 1 && (
              <div className="mt-4 flex flex-wrap justify-center gap-4 mx-auto">
                {recipe.images.map((img, index) => (
                  <div
                    key={index}
                    className="w-[90px] h-20 flex items-center justify-center bg-gray-200 rounded-xl p-4 cursor-pointer"
                    onClick={() => setCurrentImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full object-contain"
                      onError={handleError}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recipe Details Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">{recipe.title}</h2>

            <div className="mt-4 text-gray-700">{recipe.description}</div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Ingredients</h3>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {Object.entries(recipe.ingredients).map(([ingredient, amount], index) => (
                  <li key={index}>{amount} {ingredient}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Instructions</h3>
              <ol className="list-decimal list-inside mt-2 text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="mb-2">{step}</li>
                ))}
              </ol>
            </div>

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Tags:</h3>
                <p>
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="text-gray-400 ml-2">
                      #{tag}
                    </span>
                  ))}
                </p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-8">
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
    </div>
  );
}
