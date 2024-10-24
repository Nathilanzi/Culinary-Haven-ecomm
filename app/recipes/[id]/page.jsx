import { getRecipeById } from "../../../lib/api";
import ImageSelector from "../../../components/ImageSelector.jsx";
import BackButton from "../../../components/BackButton";

// Custom SVG Icons
const TimeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 512 512"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E]"
  >
    <path
      fill="#0C3B2E"
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

const ServingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 -4.83 52 52"
    fill="none"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E]"
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
        fill="#ffffff"
        stroke="#0C3B2E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      ></path>
      <line
        id="Line_51"
        data-name="Line 51"
        x2="48"
        transform="translate(790.946 1825.761)"
        fill="#ffffff"
        stroke="#0C3B2E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      ></line>
      <line
        id="Line_52"
        data-name="Line 52"
        y2="5.667"
        transform="translate(814.946 1787.428)"
        fill="#ffffff"
        stroke="#0C3B2E"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      ></line>
    </g>
  </svg>
);

const CookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 256 256"
    strokeWidth="1.0"
    stroke="currentColor"
    className="w-6 h-6 text-[#0C3B2E]"
  >
    <path
      fill="#0C3B2E"
      d="M76,40V16a12,12,0,0,1,24,0V40a12,12,0,0,1-24,0Zm52,12a12,12,0,0,0,12-12V16a12,12,0,0,0-24,0V40A12,12,0,0,0,128,52Zm40,0a12,12,0,0,0,12-12V16a12,12,0,0,0-24,0V40A12,12,0,0,0,168,52Zm83.2002,53.6001L224,126v58a36.04061,36.04061,0,0,1-36,36H68a36.04061,36.04061,0,0,1-36-36V126L4.7998,105.6001A12.0002,12.0002,0,0,1,19.2002,86.3999L32,96V88A20.02229,20.02229,0,0,1,52,68H204a20.02229,20.02229,0,0,1,20,20v8l12.7998-9.6001a12.0002,12.0002,0,0,1,14.4004,19.2002ZM200,92H56v92a12.01375,12.01375,0,0,0,12,12H188a12.01375,12.01375,0,0,0,12-12Z"
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
      keywords: [...recipe.tags, "recipe", "cooking", "food", ...ingredients.split(", ")],
      openGraph: {
        title: recipe.title,
        description: recipe.description,
        images: recipe.images.map(image => ({
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
        "total-time": `${parseInt(recipe.prep) + parseInt(recipe.cook)} minutes`,
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

export default async function RecipeDetail({ params }) {
  const { id } = params;

  let recipe;
  try {
    recipe = await getRecipeById(id);
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 font-medium mb-4">
            Error: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg transition-colors hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Retry
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg transition-colors hover:bg-teal-600 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Return to HomePage
          </button>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-gray-700 font-medium">Recipe not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen pb-12">
      <div className="p-4 lg:max-w-7xl max-w-2xl mx-auto">
        {/* Back Button at the top */}
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Image Gallery Section */}
          <div className="lg:col-span-3 w-full lg:sticky top-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <ImageSelector images={recipe.images} />
            </div>
          </div>

          {/* Recipe Details Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-3xl font-bold text-gray-900">
                {recipe.title}
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {recipe.description}
              </p>

              {/* Recipe Meta Info */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <TimeIcon />
                  <span className="text-sm font-medium mt-2">
                    {recipe.prep}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <ServingsIcon />
                  <span className="text-sm font-medium mt-2">
                    {recipe.servings}
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
                  <CookIcon />
                  <span className="text-sm font-medium mt-2">
                    {recipe.cook}
                  </span>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {Object.entries(recipe.ingredients).map(
                  ([ingredient, amount], index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                      <span className="font-medium">{amount}</span>
                      <span className="mx-2">·</span>
                      <span>{ingredient}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Instructions
              </h3>
              <ol className="space-y-4">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="w-6 h-6 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-medium mr-3 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recipe Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                    >
                      #{tag}
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

