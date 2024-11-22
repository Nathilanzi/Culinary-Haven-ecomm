"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Trash2, Check, Loader2, X, Share2, PlusCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function ShoppingListPage() {
  const { data: session } = useSession();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [removingItem, setRemovingItem] = useState({});
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const [addingItem, setAddingItem] = useState({}); // State for adding new item
  const [newIngredient, setNewIngredient] = useState(""); // New ingredient input
  const [newAmount, setNewAmount] = useState(""); // New amount input

  const fetchLists = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await fetch("/api/shopping-list");
      if (!response.ok) throw new Error("Failed to fetch shopping lists");

      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, [session]);

  const removeItem = async (id, index) => {
    try {
      setRemovingItem({ id, index });
      const response = await fetch(`/api/shopping-list/${id}/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error("Failed to remove item");

      fetchLists();
      alert("Item removed successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    } finally {
      setRemovingItem({ id: null, index: null });
    }
  };

  const deleteList = async (id) => {
    try {
      setDeleting((prev) => ({ ...prev, [id]: true }));

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete shopping list");

      fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete shopping list");
    } finally {
      setDeleting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const markAsPurchased = async (id, itemIndex) => {
    try {
      const list = lists.find((l) => l._id === id);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        purchased: !updatedItems[itemIndex].purchased,
      };

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update item");
      fetchLists();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const updateQuantity = async (id, index, newQuantity) => {
    try {
      setUpdatingQuantity({ id, index });
      const list = lists.find((l) => l._id === id);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[index] = {
        ...updatedItems[index],
        amount: newQuantity,
      };

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
      fetchLists();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingQuantity({ id: null, index: null });
    }
  };

  // Function to add a new item to an existing shopping list
  const addItemToList = async (listId) => {
    if (!newIngredient || !newAmount) return; // Ensure ingredient and amount are provided

    try {
      setAddingItem({ id: listId });
      const list = lists.find((l) => l._id === listId);
      if (!list) return;

      const updatedItems = [...list.items, { ingredient: newIngredient, amount: newAmount, purchased: false }];

      const response = await fetch(`/api/shopping-list/${listId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to add new item");

      setNewIngredient(""); // Reset the input field
      setNewAmount(""); // Reset the input field
      fetchLists();
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setAddingItem({ id: null });
    }
  };

  const generateWhatsAppLink = (list) => {
    const listText = list.items
      .map((item) => `${item.amount} ${item.ingredient}${item.purchased ? ' (Purchased)' : ''}`)
      .join("\n");

    const message = encodeURIComponent(`Shopping List: \n${listText}`);
    return `https://wa.me/?text=${message}`;
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please sign in to view your shopping lists
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-3 text-teal-600 dark:text-teal-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Shopping Lists
            </h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't created any shopping lists yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {lists.map((list) => (
                <div
                  key={list._id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {list.name ||
                          `Shopping List ${new Date(
                            list.createdAt
                          ).toLocaleDateString()}`}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Created: {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={generateWhatsAppLink(list)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => deleteList(list._id)}
                        disabled={deleting[list._id]}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {deleting[list._id] ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* List items */}
                  <div className="space-y-2">
                    {list.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => markAsPurchased(list._id, index)}
                            className={`${
                              item.purchased ? "text-teal-600" : "text-gray-600"
                            }`}
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <span
                            className={`${
                              item.purchased ? "line-through text-gray-500" : ""
                            }`}
                          >
                            {item.amount} {item.ingredient}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => removeItem(list._id, index)}
                            disabled={removingItem.id === list._id && removingItem.index === index}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {removingItem.id === list._id && removingItem.index === index ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              updateQuantity(list._id, index, e.target.value)
                            }
                            className="w-16 px-2 py-1 border rounded-md text-sm text-gray-800 dark:text-gray-100 dark:bg-gray-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new item */}
                  <div className="mt-4">
                    <input
                      type="text"
                      placeholder="Ingredient name"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md text-sm dark:bg-gray-700 dark:text-gray-100"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md text-sm mt-2 dark:bg-gray-700 dark:text-gray-100"
                    />
                    <button
                      onClick={() => addItemToList(list._id)}
                      disabled={addingItem.id === list._id}
                      className="mt-2 w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
                    >
                      {addingItem.id === list._id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <PlusCircle className="w-5 h-5 mr-2" />
                      )}
                      Add Item
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
