"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Trash2, Check, Loader2, X, Share2 } from "lucide-react";
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
  const [addingItem, setAddingItem] = useState({}); // State for adding new item
  const [newIngredient, setNewIngredient] = useState(""); // New ingredient input
  const [newAmount, setNewAmount] = useState(""); // New amount input

  const fetchLists = async () => {
    try {
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
    } catch (error) {
      setError("Error removing item: " + error.message);
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

  // Loading state
  if (loading) return <LoadingPage />;

  // Error state
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;

  // Ensure session exists (redundant with useEffect, but added for type safety)
  if (!session) return null;

  return (
    <div className="container mx-auto px-4 py-8">
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
                        className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <Share2 className="w-5 h-5" />
                      </a>
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
                  </div>
                  <ul className="space-y-2">
                    {list.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={item.purchased}
                            onChange={() => markAsPurchased(list._id, index)}
                            className="h-4 w-4 text-teal-600 dark:text-teal-400"
                          />
                          <span
                            className={`${
                              item.purchased ? "line-through text-gray-500" : ""
                            } text-sm font-medium text-gray-900 dark:text-gray-100`}
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
                            disabled={updatingQuantity.id === list._id && updatingQuantity.index === index}
                            className="w-16 text-center text-sm bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none"
                          />
                          <button
                            onClick={() => removeItem(list._id, index)}
                            disabled={removingItem.id === list._id && removingItem.index === index}
                            className="ml-3 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                          >
                            {removingItem.id === list._id &&
                            removingItem.index === index ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <X className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}