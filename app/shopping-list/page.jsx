"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Check,
  Loader2,
  X,
  Share2,
  PlusCircle,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import LoadingPage from "../loading";

export default function ShoppingListPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState({});
  const [removingItem, setRemovingItem] = useState({});
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [newItemAmount, setNewItemAmount] = useState(1);
  const [newItemIngredient, setNewItemIngredient] = useState("");
  const [addingManualItem, setAddingManualItem] = useState(null);

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/shopping-list", {
        headers: {
          "user-id": session.user.id,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch shopping lists");

      const data = await response.json();
      setLists(data);
    } catch (error) {
      setError("Error fetching shopping lists: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchLists();
  }, [session, router]);

  const removeItem = async (id, index) => {
    try {
      setRemovingItem({ id, index });
      const response = await fetch(`/api/shopping-list/${id}/items`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error("Failed to remove item");

      fetchLists();
      alert("Item removed successfully!");
    } catch (error) {
      setError("Error removing item: " + error.message);
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
        headers: {
          "user-id": session.user.id,
        },
      });

      if (!response.ok) throw new Error("Failed to delete shopping list");

      fetchLists();
    } catch (error) {
      setError("Error deleting list: " + error.message);
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
          "user-id": session.user.id,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update item");
      fetchLists();
    } catch (error) {
      setError("Error updating item: " + error.message);
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
          "user-id": session.user.id,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
      fetchLists();
    } catch (error) {
      setError("Error updating quantity: " + error.message);
    } finally {
      setUpdatingQuantity({ id: null, index: null });
    }
  };

  // Function to generate the WhatsApp sharing link
  const generateWhatsAppLink = (list) => {
    const listText = list.items
      .map(
        (item) =>
          `${item.amount} ${item.ingredient}${
            item.purchased ? " (Purchased)" : ""
          }`
      )
      .join("\n");

    const message = encodeURIComponent(`Shopping List: \n${listText}`);
    return `https://wa.me/?text=${message}`;
  };

  const createShoppingList = async () => {
    if (!session) {
      alert("Please sign in to create a shopping list");
      return;
    }
    if (!newListName.trim()) {
      alert("Please enter a name for your shopping list");
      return;
    }

    try {
      setCreatingList(true);
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ name: newListName.trim(), items: [] }),
      });

      if (!response.ok) throw new Error("Failed to create shopping list");

      setNewListName("");
      fetchLists();
      alert("Shopping list created successfully!");
    } catch (error) {
      console.error("Error creating shopping list:", error);
      alert("Failed to create shopping list");
    } finally {
      setCreatingList(false);
    }
  };

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchLists();
  }, [session, router]);

  // Loading state
  if (loading) return <LoadingPage />;

  // Error state
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  // Ensure session exists (redundant with useEffect, but added for type safety)
  if (!session) return null;

  const addManualItem = async (id) => {
    if (!newItemIngredient.trim()) {
      alert("Please enter an item name");
      return;
    }

    try {
      setAddingManualItem(id);
      const list = lists.find((l) => l._id === id);
      if (!list) return;

      const newItem = {
        ingredient: newItemIngredient.trim(),
        amount: newItemAmount,
        purchased: false,
      };

      const updatedItems = [...list.items, newItem];

      const response = await fetch(`/api/shopping-list/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "user-id": session.user.id,
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) throw new Error("Failed to add manual item");

      // Reset input fields
      setNewItemIngredient("");
      setNewItemAmount(1);

      // Refresh lists
      fetchLists();
    } catch (error) {
      setError("Error adding manual item: " + error.message);
      alert("Failed to add item to shopping list");
    } finally {
      setAddingManualItem(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* Fixed position back button */}
      <div className="fixed top-4 -left-20 z-50">
        <BackButton className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-2 hover:bg-white transition-colors dark:bg-gray-800 dark:hover:bg-gray-700" />
      </div>
      <h1 className="text-4xl font-bold mb-10 dark:text-white text-center tracking-tight text-gray-700 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
        My Shopping Lists
      </h1>

      <div className="mx-auto space-y-8 max-w-7xl">
        {/* List Creation Section */}
        <div className="bg-white dark:bg-gray-750 shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Create a new shopping list"
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
              />
              <button
                onClick={createShoppingList}
                disabled={creatingList}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
              >
                {creatingList && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>{creatingList ? "Creating..." : "Create List"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Shopping Lists Grid */}
        {lists.length === 0 ? (
          <div className="text-center py-12 px-6">
            <ShoppingCart className="mx-auto w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              You haven't created any shopping lists yet. Start by creating one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <div
                key={list._id}
                className="bg-white dark:bg-gray-750 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {list.name ||
                          `Shopping List - ${new Date(
                            list.createdAt
                          ).toLocaleDateString()}`}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Created on{" "}
                        {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href={generateWhatsAppLink(list)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => deleteList(list._id)}
                        disabled={deleting[list._id]}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                      >
                        {deleting[list._id] ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Manual Item Addition */}
                  <div className="flex space-x-2 mb-4">
                    <input
                      type="number"
                      value={newItemAmount}
                      onChange={(e) =>
                        setNewItemAmount(parseInt(e.target.value, 10) || 1)
                      }
                      min="1"
                      className="w-20 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="text"
                      value={newItemIngredient}
                      onChange={(e) => setNewItemIngredient(e.target.value)}
                      placeholder="Add custom item"
                      className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => addManualItem(list._id)}
                      disabled={addingManualItem === list._id}
                      className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 disabled:opacity-50 transition-colors"
                    >
                      {addingManualItem === list._id ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <PlusCircle className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {list.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => markAsPurchased(list._id, index)}
                            className={`
                              w-5 h-5 rounded-full border-2 flex items-center justify-center
                              transition-all duration-300
                              ${
                                item.purchased
                                  ? "bg-emerald-500 border-emerald-500"
                                  : "border-gray-300 dark:border-gray-600 hover:border-emerald-500"
                              }
                            `}
                          >
                            {item.purchased && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </button>
                          <span
                            className={`
                              ${
                                item.purchased
                                  ? "line-through text-gray-500 dark:text-gray-400"
                                  : "text-gray-800 dark:text-gray-200"
                              }
                              transition-colors duration-300
                            `}
                          >
                            {item.amount} {item.ingredient}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={item.amount}
                            onChange={(e) =>
                              updateQuantity(
                                list._id,
                                index,
                                parseInt(e.target.value, 10)
                              )
                            }
                            disabled={
                              updatingQuantity.id === list._id &&
                              updatingQuantity.index === index
                            }
                            className="w-20 text-center text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                          />
                          <button
                            onClick={() => removeItem(list._id, index)}
                            disabled={
                              removingItem.id === list._id &&
                              removingItem.index === index
                            }
                            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 transition-colors"
                          >
                            {removingItem.id === list._id &&
                            removingItem.index === index ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
