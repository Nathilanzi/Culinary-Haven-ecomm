"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  PlusCircle,
  MinusCircle,
  ShoppingCart,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ShoppingList({ ingredients }) {
  const { data: session } = useSession();
  const [selectedItems, setSelectedItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLists, setFetchingLists] = useState(true);
  const [addingToList, setAddingToList] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [listName, setListName] = useState("");
  const [isVisible, setIsVisible] = useState(true); // Visibility toggle

  useEffect(() => {
    if (session) {
      fetchLists();
    }
  }, [session]);

  const fetchLists = async () => {
    try {
      setFetchingLists(true);
      const response = await fetch("/api/shopping-list");
      if (!response.ok) throw new Error("Failed to fetch shopping lists");
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      toast.error("Failed to fetch shopping lists");
    } finally {
      setFetchingLists(false);
    }
  };

  const toggleItem = (ingredient, amount) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.ingredient === ingredient);
      if (exists) {
        return prev.filter((item) => item.ingredient !== ingredient);
      }
      return [...prev, { ingredient, amount }];
    });
  };

  const handleQuantityChange = (ingredient, newAmount) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.ingredient === ingredient ? { ...item, amount: newAmount } : item
      )
    );
  };

  const createShoppingList = async () => {
    if (!session) {
      toast.error("Please sign in to create a shopping list");
      return;
    }
    if (!listName.trim()) {
      toast.error("Please enter a name for your shopping list");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: listName.trim(), items: selectedItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to create shopping list");
      }

      setListName("");
      setSelectedItems([]);
      toast.success("Shopping list created successfully!");
      fetchLists();
    } catch (error) {
      console.error("Error creating shopping list:", error);
      toast.error("Failed to create shopping list");
    } finally {
      setLoading(false);
    }
  };

  const addItemsToList = async (id) => {
    if (!selectedItems.length) {
      toast.error("Please select items to add");
      return;
    }

    try {
      setAddingToList(id);
      const response = await fetch(`/api/shopping-list/${id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to add items to the list");
      }

      setSelectedItems([]);
      toast.success("Items added to list successfully!");
      setSelectedItems([]);
      fetchLists();
      setSelectedId(null);
    } catch (error) {
      console.error("Error adding items to list:", error);
      toast.error("Failed to add items to the list");
    } finally {
      setAddingToList(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6 dark:bg-gray-700">
      <div className="flex items-center gap-2">
        <ShoppingCart className="w-6 h-6 text-teal-600 dark:text-teal-400" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Add to Shopping List
        </h2>
      </div>

      {/* Toggle Visibility Button */}
      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="mb-4 bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700 transition-colors dark:bg-[#2D7356] dark:hover:bg-[#256B4C]"
      >
        {isVisible ? "Hide Shopping List" : "Show Shopping List"}
      </button>

      {/* Conditionally render content */}
      {isVisible && (
        <>
          {/* Ingredient Selection */}
          <div className="space-y-4">
            {Object.entries(ingredients).map(([ingredient, amount]) => (
              <div
                key={ingredient}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {amount} {ingredient}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleItem(ingredient, amount)}
                    className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    {selectedItems.find(
                      (item) => item.ingredient === ingredient
                    ) ? (
                      <MinusCircle className="w-6 h-6" />
                    ) : (
                      <PlusCircle className="w-6 h-6" />
                    )}
                  </button>
                  {selectedItems.find(
                    (item) => item.ingredient === ingredient
                  ) && (
                    <input
                      type="number"
                      min="1"
                      value={
                        selectedItems.find(
                          (item) => item.ingredient === ingredient
                        ).amount
                      }
                      onChange={(e) =>
                        handleQuantityChange(ingredient, e.target.value)
                      }
                      className="w-16 p-1 border rounded-md"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {selectedItems.length > 0 && (
            <div className="mt-6 space-y-4">
              {/* List Name Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter list name"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="w-full mt-4 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>

              <button
                onClick={createShoppingList}
                disabled={loading}
                className="w-full mt-2 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-teal-500 dark:hover:bg-teal-600"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create New List"
                )}
              </button>

              {/* Add to Existing List */}
              {lists.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setSelectedId(selectedId ? null : "select")}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    Add to Existing List
                  </button>

                  {selectedId === "select" && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="p-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select a list
                          </span>
                          <button
                            onClick={() => setSelectedId(null)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {lists.map((list) => (
                          <button
                            key={list._id}
                            onClick={() => addItemsToList(list._id)}
                            disabled={addingToList === list._id}
                            className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex justify-between items-center"
                          >
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                              {list.name ||
                                `Shopping List ${new Date(
                                  list.createdAt
                                ).toLocaleDateString()}`}
                            </h2>

                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              List from{" "}
                              {new Date(list.createdAt).toLocaleDateString()}
                            </span>
                            {addingToList === list._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
