import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes, searchQuery }) {
  return (
    <div id="recipes-section" className="pt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} searchQuery={searchQuery} />
          ))}
        </div>
      </div>
    </div>
  );
}

