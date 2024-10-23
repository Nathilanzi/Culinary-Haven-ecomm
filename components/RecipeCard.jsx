import Link from "next/link";
import Gallery from "./Gallery";

export default function RecipeCard({ recipe }) {
  return (
    <div class="container" className="border rounded-2xl overflow-hidden bg-white shadow-md transition-transform transform hover:scale-105">
      <Link
        href={`/recipes/${recipe._id}`}
        key={recipe._id}
      >
        {/* Image Section */}
        <div className="-m-3 overflow-hidden relative">
          <Gallery images={[...recipe.images]} />

        </div>

        {/* Text Section */}
        <div className="flex-1 flex flex-col p-4">
            <div className="flex-1">
                <header className="flex-2">
             <h3 className="font-bold text-lg mb-2 text-gray-800 leading-snug">{recipe.title}</h3>
             </header>
            </div>
          

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
      </Link>
    </div>
  );
}
