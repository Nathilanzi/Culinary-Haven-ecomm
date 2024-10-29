"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function CategoryFilter({ categories, currentCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const clearFilters = () => {
    setSelectedCategory("");
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategory && selectedCategory !== "All Categories") {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    params.delete("page");
    router.push(`/?${params.toString()}`);
    toggleModal();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleModal}
        className="appearance-none w-full md:w-48 px-6 py-3 pr-10 bg-emerald-950/30 
          border-2 border-emerald-800/50 rounded-full text-emerald-50
          focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50
          transition-all duration-300 cursor-pointer"
      >
        {selectedCategory || "All Categories"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-lg relative">
            {/* Close Button */}
            <button
              onClick={toggleModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
            
            <h2 className="text-lg font-semibold text-emerald-900 mb-4">Filter by Category</h2>
            
            {/* Category Filter */}
            <select
              value={selectedCategory || ""}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="appearance-none w-full px-6 py-3 pr-10 bg-emerald-950/30 
                border-2 border-emerald-800/50 rounded-full text-emerald-900
                focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50
                transition-all duration-300 cursor-pointer mb-4"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-800"
              >
                Clear All Filters
              </button>
              <button
                onClick={applyFilters}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
