import { getRecipeById } from "../../../lib/api";
import ImageSelector from "../../../components/ImageSelector.jsx";
import BackButton from "../../../components/BackButton";
import ReviewSection from "@/components/ReviewSection";
import RecipeEdit from "@/components/RecipeEdit";
import Link from "next/link";

const TimeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E] dark:text-[#A3C9A7]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M512,200.388c-0.016-63.431-51.406-114.828-114.845-114.836c-11.782-0.008-23.118,1.952-33.846,5.275
    C338.408,58.998,299.57,38.497,256,38.497c-43.57,0-82.408,20.501-107.309,52.329c-10.737-3.322-22.073-5.283-33.846-5.275
    C51.406,85.56,0.016,136.957,0,200.388c0.008,54.121,37.46,99.352,87.837,111.523c-11.368,35.548-21.594,81.104-21.538,140.848v20.744
    h379.402v-20.744c0.056-59.744-10.169-105.3-21.538-140.848C474.54,299.741,511.984,254.509,512,200.388z M449.023,252.265
    c-13.322,13.297-31.505,21.456-51.803,21.48l-0.51-0.007l-30.524-0.77l10.534,28.66c11.977,32.704,24.464,72.928,27,130.387
    H108.281c2.536-57.459,15.023-97.683,27-130.387l10.534-28.669l-31.043,0.786c-20.29-0.024-38.473-8.184-51.803-21.48
    c-13.305-13.338-21.473-31.546-21.481-51.876c0.008-20.322,8.176-38.53,21.481-51.867c13.346-13.306,31.554-21.473,51.876-21.482
    c11.725,0.008,22.689,2.731,32.493,7.577l17.251,8.54l9.804-16.571C190.956,98.663,221.222,79.977,256,79.985
    c34.778-0.008,65.044,18.678,81.606,46.601l9.796,16.571l17.26-8.54c9.804-4.846,20.761-7.568,32.493-7.577
    c20.322,0.008,38.531,8.176,51.876,21.482c13.305,13.338,21.473,31.545,21.481,51.867
    C470.505,220.719,462.337,238.927,449.023,252.265z"
    />
  </svg>
);

const TotalTime = () => (
  <svg className="h-7 text-black" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* <!-- Clock face --> */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
  
    {/* <!-- Hour markers --> */}
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(0 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(30 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(60 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(90 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(120 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(150 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(180 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(210 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(240 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(270 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(300 50 50)"/>
    <line x1="50" y1="10" x2="50" y2="15" stroke="currentColor" strokeWidth="2" transform="rotate(330 50 50)"/>
  
    {/* <!-- Hour hand (pointing to 10) --> */}
    <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="rotate(-60 50 50)"/>
  
    {/* <!-- Minute hand (pointing to 2) --> */}
    <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="rotate(60 50 50)"/>
  
    {/* <!-- Center dot --> */}
    <circle cx="50" cy="50" r="2" fill="currentColor"/>
  </svg>
);

const ServingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 -4.83 52 52"
    fill="none"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E] dark:text-[#A3C9A7]"
  >
    <g
      id="Group_49"
      data-name="Group 49"
      transform="translate(-788.946 -1785.428)"
    >
      <path
        id="Path_131"
        data-name="Path 131"
        d="M814.946,1793.095a24,24,0,0,0-24,24h48A24,24,0,0,0,814.946,1793.095Z"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <line
        id="Line_51"
        data-name="Line 51"
        x2="48"
        transform="translate(790.946 1825.761)"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
      <line
        id="Line_52"
        data-name="Line 52"
        y2="5.667"
        transform="translate(814.946 1787.428)"
        fill="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </g>
  </svg>
);

const CookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 256 256"
    strokeWidth="1.0"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E] dark:text-[#A3C9A7]"
  >
    <path
      d="M76,40V16a12,12,0,0,1,24,0V40a12,12,0,0,1-24,0Zm52,12a12,12,0,0,0,12-12V16a12,12,0,0,0-24,0V40A12,12,0,0,0,128,52Zm40,0a12,12,0,0,0,12-12V16a12,12,0,0,0-24,0V40A12,12,0,0,0,168,52Zm83.2002,53.6001L224,126v58a36.04061,36.04061,0,0,1-36,36H68a36.04061,36.04061,0,0,1-36-36V126L4.7998,105.6001A12.0002,12.0002,0,0,1,19.2002,86.3999L32,96V88A20.02229,20.02229,0,0,1,52,68H204a20.02229,20.02229,0,0,1,20,20v8l12.7998-9.6001a12.0002,12.0002,0,0,1,14.4004,19.2002ZM200,92H56v92a12.01375,12.01375,0,0,0,12,12H188a12.01375,12.01375,0,0,0,12-12Z"
    />
  </svg>
);

const NutritionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E] dark:text-[#A3C9A7]"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.589-1.202L5.25 4.97z"
    />
  </svg>
);

export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return {
        title: "Recipe Not Found",
        description: "The requested recipe could not be found.",
      };
    }

    const ingredients = Object.keys(recipe.ingredients).join(", ");

    return {
      title: recipe.title,
      description: `${recipe.description.slice(0, 155)}...`,
      keywords: [
        ...recipe.tags,
        "recipe",
        "cooking",
        "food",
        ...ingredients.split(", "),
      ],
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: recipe.images.map((image) => ({
          url: image,
          width: 1200,
          height: 630,
          alt: `${recipe.title} - Recipe Image`,
        })),
        type: "article",
        article: {
          publishedTime: recipe.publishedDate,
          modifiedTime: recipe.updatedDate,
          tags: recipe.tags,
        },
      },
      twitter: {
        card: "summary_large_image",
        title: recipe.title,
        description: recipe.description,
        images: recipe.images[0],
      },
      other: {
        "prep-time": recipe.prep,
        "cook-time": recipe.cook,
        "total-time": `${parseInt(recipe.prep) + parseInt(recipe.cook)} minutes`, // Corrected
        "recipe-yield": recipe.servings,
      },
    };
  } catch (error) {
    return {
      title: "Error Loading Recipe",
      description: "There was an error loading the recipe.",
    };
  }
}

const formatNutritionData = (nutrition) => {
  // If nutrition is already an array, return it
  if (Array.isArray(nutrition)) {
    return nutrition;
  }

  // If nutrition is an object, convert it to array format
  if (nutrition && typeof nutrition === "object") {
    return Object.entries(nutrition).map(([label, value]) => {
      // Handle cases where value might be a string with unit
      if (typeof value === "string") {
        const match = value.match(/(\d+(?:\.\d+)?)\s*(\w+)?/);
        if (match) {
          return {
            label,
            value: match[1],
            unit: match[2] || "",
          };
        }
      }
      // Handle cases where value is a number
      return {
        label,
        value: value.toString(),
        unit: "",
      };
    });
  }

  // If nutrition is not in a valid format, return null
  return null;
};

export default async function RecipeDetail({ params }) {
  const { id } = params;

  let recipe;
  try {
    recipe = await getRecipeById(id);
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4 dark:bg-gray-700">
          <p className="text-red-500 font-medium dark:text-red-400">Error: {error.message}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg transition-colors hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:hover:bg-teal-500"
            >
              Retry
            </button>
            <Link href="/">
  <button
    className="px-6 py-2 bg-teal-500 text-white rounded-lg transition-colors hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-400 dark:hover:bg-teal-500"
  >
    Return to HomePage
  </button>
</Link>

          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
        <div className="bg-white p-8 rounded-2xl shadow-lg dark:bg-gray-700">
          <p className="text-gray-700 font-medium dark:text-gray-300">Recipe not found</p>
        </div>
      </div>
    );
  }

  // Calculate total time
  const prepTime = parseInt(recipe.prep) || 0;
  const cookTime = parseInt(recipe.cook) || 0;
  const totalTime = prepTime + cookTime;

  // Format nutrition data
  const nutritionData = formatNutritionData(recipe.nutrition);

  return (
    <div className="font-sans pt-16 bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>

      <div className="px-4 py-8 lg:py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Image Gallery Section */}
          <div className="w-full lg:h-fit lg:sticky lg:top-20 lg:self-start">
            {/* Updated classes */}
            <div className="bg-white rounded-2xl p-2 shadow-sm overflow-hidden dark:bg-gray-800">
              <ImageSelector images={recipe.images} />
            </div>
          </div>
          {/* Recipe Details Section */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm dark:bg-gray-700">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
                {recipe.title}
              </h1>
              <p className="text-gray-600 leading-relaxed dark:text-gray-300">
                {recipe.description}
              </p>

              {/* Recipe Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6 max-w-3xl mx-auto px-2 sm:px-0">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <TimeIcon />
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    Prep: {recipe.prep}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <ServingsIcon />
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    Serves: {recipe.servings}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <CookIcon />
                  <span className="text-sm text-gray-500 font-medium mt-2">
                    Cook: {recipe.cook}
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600">
                  <TotalTime />
                  <span className="text-sm text-gray-500 font-medium mt-2 dark:text-gray-400">
                    Total: {totalTime} min
                  </span>
                </div>
              </div>
            </div>

            {/* Nutrition Section */}
            {nutritionData && nutritionData.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <NutritionIcon />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Nutrition Facts
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {nutritionData.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors  dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                      <div className="text-lg font-semibold text-teal-700 dark:text-teal-400">
                        {item.value}
                        <span className="text-sm ml-1 text-teal-600 dark:text-teal-300">
                          {item.unit}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm dark:bg-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Ingredients
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(recipe.ingredients).map(
                  ([ingredient, amount], index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
                    >
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3 dark:bg-teal-400"></span>
                      <span className="font-medium">{amount}</span>
                      <span className="mx-2">·</span>
                      <span>{ingredient}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm dark:bg-gray-700">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Instructions
              </h2>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li
                    key={index}
                    className="flex bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <span className="w-8 h-8 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-medium mr-4 flex-shrink-0 dark:bg-teal-700 dark:text-teal-300">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed dark:text-gray-300">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Review Section */}
            <div className="mt-8">
              <ReviewSection recipeId={id} />
            </div>

            {/*Decription Editting  */}
            <div className="mt-8">
              <RecipeEdit recipe={recipe} />
            </div>
            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm dark:bg-gray-700">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tags
                </h2>
                <div className="flex flex-wrap gap-3">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-teal-100 text-teal-800 text-sm px-4 py-2 rounded-full dark:bg-teal-700 dark:text-teal-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
