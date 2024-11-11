'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const RecipeEdit = ({ recipe, onSave }) => {
  const { data: session, status } = useSession();
  const [description, setDescription] = useState(recipe.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


  useEffect(() => {
    if (!session) {
      setError('You must be logged in to edit this recipe.');
    }
  }, [session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!session) {
      signIn();
      return;
    }
  
    console.log('User name:', session.user.name);
    console.log('Recipe ID:', recipe.id);  
    
    if (!recipe.id) {
      setError("Recipe ID is missing.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const response = await fetch(`/api/recipes/${recipe.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({ description }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update recipe');
      }
  
      const updatedData = await response.json();
  

      if (onSave) {
        onSave({
          ...recipe,
          description,
          lastEditedBy: session.user.id,
          lastEditedAt: new Date().toISOString(),
        });
      }
  
      setSuccessMessage('Description updated successfully!');
    } catch (error) {
      setError(error.message || 'An error occurred while updating.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    setDescription(recipe.description);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="bg-white  dark:bg-gray-700 p-6 rounded-2xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Edit Description</h2>

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Edit the description here..."
        />

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="bg-teal-600 text-white rounded-lg px-4 py-2 hover:bg-teal-500 transition-colors disabled:opacity-50"
            disabled={loading || description.trim() === '' || !session}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Last Edited Info */}
      <div className="mt-4 text-gray-500">
        Last edited by: {recipe.lastEditedBy || 'Unknown'} on{' '}
        {recipe.lastEditedAt ? new Date(recipe.lastEditedAt).toLocaleDateString() : 'N/A'}
      </div>

      {!session && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p>
            Please <button onClick={() => signIn()} className="text-blue-600 hover:underline">sign in</button> to edit the recipe.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipeEdit;
