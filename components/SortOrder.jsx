"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from './Loader'; 

export default function SortOrder() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSort, setCurrentSort] = useState('$natural');
  const [currentOrder, setCurrentOrder] = useState('asc');
  const router = useRouter();
  const searchParams = useSearchParams();

  
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true); 
      try {
        const response = await fetch('/api/recipes'); 
        const data = await response.json();
        setRecipes(data); 
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchRecipes();
  }, [currentSort, currentOrder]); 

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split("-");
    const params = new URLSearchParams(searchParams);

    params.set("sortBy", sortBy);
    params.set("order", order);
    params.delete("page");
    router.push(`/?${params.toString()}`);
    
    
    setCurrentSort(sortBy);
    setCurrentOrder(order);
  };

  return (
    <div>
      <div className="relative">
        <select
          value={`${currentSort}-${currentOrder}`}
          onChange={handleSortChange}
          className="appearance-none w-full md:w-56 px-6 py-3 pr-10 bg-emerald-950/30 
            border-2 border-emerald-800/50 rounded-full text-emerald-50
            focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50
            transition-all duration-300 cursor-pointer"
        >
          <option value="$natural-asc">Default Sort</option>
          <option value="prep-asc">Prep Time (Low to High)</option>
          <option value="prep-desc">Prep Time (High to Low)</option>
          <option value="cook-asc">Cook Time (Low to High)</option>
          <option value="cook-desc">Cook Time (High to Low)</option>
          <option value="published-asc">Date Published (Oldest to Newest)</option>
          <option value="published-desc">Date Published (Newest to Oldest)</option>
          <option value="instructionCount-asc">Steps (Fewest to Most)</option>
          <option value="instructionCount-desc">Steps (Most to Fewest)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-emerald-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

     
      {loading ? (
        <Loader />
      ) : (
        <div className="recipes-container">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="recipe">
                <h2>{recipe.title}</h2>
                {/* Add more recipe details here */}
              </div>
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      )}
    </div>
  );
}
