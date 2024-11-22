"use client"

import React from 'react';
import { useState } from 'react';
import { ListPlus } from 'lucide-react';

const AddRecipeToListButton = ({ ingredients, shoppingListId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addIngredientsToList = async () => {
    try {
      setIsLoading(true);
      
      // Transform ingredients object into array format expected by the API
      const items = Object.entries(ingredients).map(([item, amount]) => ({
        name: item,
        quantity: amount,
      }));

      const response = await fetch(`/api/shopping_lists/${shoppingListId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: Expected JSON response but got " + contentType);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add ingredients to shopping list');
      }

      showNotification(`${items.length} ingredients added to shopping list`);
    } catch (error) {
      console.error('Error adding ingredients:', error);
      let errorMessage = error.message;
      
      // Handle network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Network error: Please check your connection';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={addIngredientsToList}
        disabled={isLoading}
        className="flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-teal-600 dark:hover:bg-teal-700"
      >
        <ListPlus className="w-4 h-4 mr-2" />
        {isLoading ? 'Adding...' : 'Add All to Shopping List'}
      </button>

      {notification && (
        <div className={`absolute top-full mt-2 right-0 p-3 rounded-lg shadow-lg text-sm w-64 z-50 ${
          notification.type === 'error' 
            ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-100' 
            : 'bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-100'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AddRecipeToListButton;