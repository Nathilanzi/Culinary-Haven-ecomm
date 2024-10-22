import Link from "next/link";
import Gallery from "./Gallery";

export default function RecipeCard({ recipe }) {
  return (
    <Link
      href={`/recipes/${recipe._id}`}
      key={recipe._id}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="-m-3">
        <Gallery images={[...recipe.images]} />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Prep: {recipe.prep} min</span>
          <span>Cook: {recipe.cook} min</span>
        </div>
      </div>
    </Link>
  );
}
