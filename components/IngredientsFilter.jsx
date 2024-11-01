'use client';

import { useState, useEffect, useRef } from 'react';

export default function IngredientsFilter({ availableIngredients = [], searchParams, updateUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentIngredients = searchParams.getAll('ingredients[]');
  const currentMatchType = searchParams.get('ingredientMatchType') || 'all';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIngredientClick = (ingredient) => {
    const newIngredients = currentIngredients.includes(ingredient)
      ? currentIngredients.filter((i) => i !== ingredient)
      : [...currentIngredients, ingredient];
    
    updateUrl({
      'ingredients[]': newIngredients,
      ingredientMatchType: currentMatchType,
    });
  };

  const handleMatchTypeChange = (newMatchType) => {
    updateUrl({
      'ingredients[]': currentIngredients,
      ingredientMatchType: newMatchType,
    });
  };

  const clearAllIngredients = () => {
    updateUrl({
      'ingredients[]': [],
      ingredientMatchType: null,
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2.5 bg-green-800 
                   text-white border border-green-700 rounded-lg 
                   shadow-lg hover:bg-green-700 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-green-500 
                   focus:ring-opacity-50"
      >
        <span className="font-medium">Filter by Ingredients</span>
        {currentIngredients.length > 0 && (
          <span className="inline-flex items-center justify-center w-6 h-6 
                         text-xs font-semibold text-green-800 bg-white 
                         rounded-full shadow-inner">
            {currentIngredients.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 bg-white rounded-xl 
                      shadow-xl border border-green-100 transform 
                      transition-all duration-200 ease-out">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b 
                          border-green-100 pb-3">
              <h3 className="text-lg font-semibold text-green-800">Ingredient Filters</h3>
              {currentIngredients.length > 0 && (
                <button
                  onClick={clearAllIngredients}
                  className="text-sm text-red-600 hover:text-red-700 
                           font-medium transition-colors duration-200"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-green-800">Match Type</p>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="ingredientMatchType"
                    value="all"
                    checked={currentMatchType === "all"}
                    onChange={(e) => handleMatchTypeChange(e.target.value)}
                    className="text-green-800 focus:ring-green-700 cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-green-800 transition-colors duration-200">
                    All ingredients
                  </span>
                </label>
                <label className="flex items-center space-x-2 text-sm cursor-pointer group">
                  <input
                    type="radio"
                    name="ingredientMatchType"
                    value="any"
                    checked={currentMatchType === "any"}
                    onChange={(e) => handleMatchTypeChange(e.target.value)}
                    className="text-green-800 focus:ring-green-700 cursor-pointer"
                  />
                  <span className="text-gray-700 group-hover:text-green-800 transition-colors duration-200">
                    Any ingredient
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#0c3a2da5]">Available Ingredients</p>
              <div className="max-h-64 overflow-y-auto pr-1 
                            scrollbar-thin scrollbar-thumb-green-800 
                            scrollbar-track-green-100">
                <div className="grid grid-cols-2 gap-2">
                  {availableIngredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => handleIngredientClick(ingredient)}
                      className={`px-3 py-2.5 rounded-lg text-sm text-left 
                                transition-all duration-200 font-medium
                                hover:shadow-md ${
                        currentIngredients.includes(ingredient)
                          ? "bg-[#0c3b2ef4] text-white hover:bg-green-700"
                          : "bg-green-50 text-green-800 hover:bg-green-100"
                      }`}
                    >
                      {ingredient}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
