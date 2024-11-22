"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Plus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export default function ShoppingList({ ingredients }) {
  const { data: session } = useSession();
  const [selectedItems, setSelectedItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingLists, setFetchingLists] = useState(true);
  const [addingToList, setAddingToList] = useState(null);
  const [listName, setListName] = useState("");
  const [isVisible, setIsVisible] = useState(true); // Visibility toggle
  const [manualItem, setManualItem] = useState(""); // New state to handle manual item input

  useEffect(() => {
    if (session) fetchLists();
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
        item.ingredient === ingredient
          ? { ...item, amount: newAmount }
          : item
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
    if (selectedItems.length === 0) {
      toast.error("Please select items to add to the shopping list");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: listName.trim(), items: selectedItems }),
      });

      if (!response.ok) throw new Error("Failed to create shopping list");

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
    if (selectedItems.length === 0) {
      toast.error("Please select items to add to the list");
      return;
    }

    try {
      setAddingToList(id);
      const response = await fetch(`/api/shopping-list/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: selectedItems }),
      });

      if (!response.ok) throw new Error("Failed to add items to the list");

      toast.success("Items added to list successfully!");
      setSelectedItems([]);
      fetchLists();
    } catch (error) {
      console.error("Error adding items to list:", error);
      toast.error("Failed to add items to the list");
    } finally {
      setAddingToList(null);
    }
  };

  // New function to add a manual item to the shopping list
  const addManualItem = () => {
    if (!manualItem.trim()) {
      toast.error("Please enter a valid item");
      return;
    }
    setSelectedItems((prev) => [
      ...prev,
      { ingredient: manualItem.trim(), amount: "1" }, // You can set the amount to "1" or another default value
    ]);
    setManualItem(""); // Clear input after adding
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
          <div className="space-y-4">
            {Object.entries(ingredients).map(([ingredient, amount]) => (
              <div
                key={ingredient}
                className="flex items-center justify-between p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <span className="text-gray-700 dark:text-gray-300">
                  {amount} {ingredient}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleItem(ingredient, amount)}
                    className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                  >
                    {selectedItems.find((item) => item.ingredient === ingredient)
                      ? <X className="w-5 h-5" />
                      : <Plus className="w-5 h-5" />}
                  </button>
                  {selectedItems.find((item) => item.ingredient === ingredient) && (
                    <input
                      type="number"
                      min="1"
                      value={
                        selectedItems.find((item) => item.ingredient === ingredient)
                          .amount
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

          {/* Add Manual Item */}
          <div className="mt-4">
            <input
              type="text"
              value={manualItem}
              onChange={(e) => setManualItem(e.target.value)}
              placeholder="Add a manual item"
              className="w-full p-2 border rounded-md"
            />
            <button
              onClick={addManualItem}
              className="mt-2 w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
            >
              Add Item
            </button>
          </div>

          <input
            type="text"
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="w-full mt-4 p-2 border rounded-md"
          />

          <button
            onClick={createShoppingList}
            disabled={loading}
            className="w-full mt-2 bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Create Shopping List"
            )}
          </button>
        </>
      )}
    </div>
  );
}
