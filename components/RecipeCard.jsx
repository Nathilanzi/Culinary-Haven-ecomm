import Link from "next/link";
import Gallery from "./Gallery";

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-400 hover:shadow-lg hover:scale-[1.02]">
        {/* Image Section */}
        <div className="relative overflow-hidden">
          <Gallery images={[...recipe.images]} />
        </div>

        {/* Text Section */}
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{recipe.title}</h3>

          {/* Prep and Cook Time */}
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Prep: {recipe.prep} min</span>
            <span>Cook: {recipe.cook} min</span>
          </div>

          {/* View Recipe Button */}
          <Link
            href={`/recipes/${recipe._id}`}
            className="block text-center bg-[#BB8A52] text-white font-semibold py-2 rounded-lg shadow hover:bg-orange-600 transition-colors"
          >
            View Recipe
          </Link>
        </div>
    </div>
  );
}
