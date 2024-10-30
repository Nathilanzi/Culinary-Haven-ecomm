"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

// SVG Icons as components
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 ml-2 text-gray-600"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5 text-gray-500"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function CategoryFilter({ categories, currentCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);

  // Add useEffect to sync with URL changes
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category") || "";
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

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
        className="group flex items-center justify-between w-full md:w-48 px-6 py-3 bg-emerald-950/30 border-2 border-emerald-800/50 rounded-full text-emerald-50 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/50 transition-all duration-300 hover:bg-emerald-950/40 hover:border-emerald-700/60"
      >
        <span className="truncate">{selectedCategory || "All Categories"}</span>
        <ChevronDownIcon />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={toggleModal}
          />
          <div className="bg-white/95 p-8 rounded-2xl shadow-xl w-11/12 max-w-lg relative transform translate-y-0 animate-slide-up">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <CloseIcon />
            </button>

            <h2 className="text-xl font-semibold text-emerald-900 mb-6">
              Filter by Category
            </h2>

            <div className="relative mb-6">
              <select
                value={selectedCategory || ""}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="appearance-none w-full px-6 py-4 bg-emerald-950/5 border-2 border-emerald-800/20 rounded-xl text-emerald-900 focus:outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-800/30 transition-all duration-300 cursor-pointer hover:bg-emerald-950/10"
              >
                <option value="">All Categories</option>
                {categories?.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end items-center gap-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors duration-200 rounded-lg hover:bg-red-50"
              >
                Clear Filters
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
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
