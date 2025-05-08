import { useState, useEffect } from "react";
import { itemService } from "../services/itemService";
import { toast } from "react-toastify";

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await itemService.getItems();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (itemData) => {
    try {
      const { name, description, quantity, price } = itemData;
      if (!name.trim() || !description.trim() || !quantity || !price) {
        toast.error("All fields are required.");
        return false;
      }

      if (parseFloat(price) < 0 || parseInt(quantity) < 0) {
        toast.error("Price and Quantity must be non-negative.");
        return false;
      }

      const response = await itemService.addItem(itemData);
      setItems((prevItems) => [...prevItems, response.newItem]);
      return true;
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("Failed to add item");
      return false;
    }
  };

  const updateItem = async (itemId, itemData) => {
    try {
      const { name, description, quantity, price } = itemData;
      if (!name || !description || !quantity || !price) {
        toast.error("All fields are required.");
        return false;
      }

      if (parseFloat(price) < 0 || parseInt(quantity) < 0) {
        toast.error("Price and Quantity must be non-negative.");
        return false;
      }

      await itemService.updateItem(itemId, itemData);
      setItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, ...itemData } : item
        )
      );
      return true;
    } catch (err) {
      console.error("Error updating item:", err);
      toast.error("Failed to update item");
      return false;
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await itemService.deleteItem(itemId);
      console.log("delete")
      setItems(items.filter((item) => item._id !== itemId));
      return true;
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Failed to delete item");
      return false;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
  };
};
