"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Trash2, Check, Loader2, X } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function ShoppingListPage() {
  const { data: session } = useSession();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [removingItem, setRemovingItem] = useState({});

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

  const removeItem = async (listId, index) => {
    try {
      setRemovingItem({ listId, index });
      const response = await fetch(`/api/shopping-list/${listId}/items`, {
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
      setRemovingItem({ listId: null, index: null });
    }
  };

  const deleteList = async (listId) => {
    try {
      setDeleting((prev) => ({ ...prev, [listId]: true }));

      const response = await fetch(`/api/shopping-list/${listId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete shopping list");

      fetchLists();
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Failed to delete shopping list");
    } finally {
      setDeleting((prev) => ({ ...prev, [listId]: false }));
    }
  };

  const markAsPurchased = async (listId, itemIndex) => {
    try {
      const list = lists.find((l) => l._id === listId);
      if (!list) return;

      const updatedItems = [...list.items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        purchased: !updatedItems[itemIndex].purchased,
      };

      const response = await fetch(`/api/shopping-list/${listId}`, {
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
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {new Date(list.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteList(list._id)}
                      disabled={deleting[list._id]}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      {deleting[list._id] ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {list.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => markAsPurchased(list._id, index)}
                            className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center
                              ${
                                item.purchased
                                  ? "bg-teal-500 border-teal-500"
                                  : "border-gray-300 dark:border-gray-600"
                              }
                            `}
                          >
                            {item.purchased && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <span
                            className={`${
                              item.purchased
                                ? "line-through text-gray-500 dark:text-gray-400"
                                : "text-gray-800 dark:text-gray-200"
                            }`}
                          >
                            {item.amount} {item.ingredient}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(list._id, index)}
                          disabled={
                            removingItem.listId === list._id &&
                            removingItem.index === index
                          }
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        >
                          {removingItem.listId === list._id &&
                          removingItem.index === index ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <X className="w-5 h-5" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
