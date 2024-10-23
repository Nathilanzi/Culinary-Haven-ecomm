
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
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-500 text-white rounded"
        >
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

  return (
    <div className="font-sans bg-white text-black">
      <div className="p-4 lg:max-w-7xl max-w-2xl max-lg:mx-auto">
        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image Gallery Section */}
          <div className="lg:col-span-3 w-full lg:sticky top-0 text-center">
            {/* Client-side ImageSelector */}
            <ImageSelector images={recipe.images} />
          </div>

          {/* Recipe Details Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-semibold">{recipe.title}</h2>

            <div className="mt-4 text-gray-700">{recipe.description}</div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Ingredients</h3>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {Object.entries(recipe.ingredients).map(([ingredient, amount], index) => (
                  <li key={index}>
                    {amount} {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold">Instructions</h3>
              <ol className="list-decimal list-inside mt-2 text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="mb-2">
                    {step}
                  </li>
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
              <BackButton /> {/* Client-side button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
