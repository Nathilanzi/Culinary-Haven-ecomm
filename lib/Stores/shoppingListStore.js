import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the shopping list
const shoppingListStore = createContext();

export const useShoppingList = () => useContext(shoppingListStore);

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);

  // Load shopping list from localStorage if available
  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("shoppingList"));
    if (storedList) {
      setShoppingList(storedList);
    }
  }, []);

  // Save shopping list to localStorage
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addItem = (item) => {
    setShoppingList((prevList) => {
      if (!prevList.includes(item)) {
        return [...prevList, item];
      }
      return prevList;
    });
  };

  const addItems = (items) => {
    setShoppingList((prevList) => [...prevList, ...items]);
  };

  const removeItem = (item) => {
    setShoppingList((prevList) => prevList.filter((i) => i !== item));
  };

  return (
    <shoppingListStore.Provider value={{ shoppingList, addItem, addItems, removeItem }}>
      {children}
    </shoppingListStore.Provider>
  );
};
