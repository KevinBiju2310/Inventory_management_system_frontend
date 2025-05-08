import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { customerService } from "../services/customerService";
import { itemService } from "../services/itemService";
import { salesService } from "../services/salesService";
import { toast } from "react-toastify";

export const usePurchase = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [customersData, itemsData] = await Promise.all([
        customerService.getCustomers(),
        itemService.getItems(),
      ]);

      setCustomers(customersData);
      setItems(itemsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = (itemId) => {
    if (!itemId) return;

    const itemExists = selectedItems.find((item) => item.itemId === itemId);
    if (itemExists) {
      toast.info("Item already added to purchase");
      return;
    }

    const selectedItem = items.find((item) => item._id === itemId);
    if (selectedItem) {
      setSelectedItems([
        ...selectedItems,
        {
          itemId,
          name: selectedItem.name,
          price: selectedItem.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      toast.warn("Quantity must be at least 1");
      return;
    }

    setSelectedItems(
      selectedItems.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.itemId !== itemId));
  };

  const totalAmount = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePurchase = async () => {
    if (!selectedCustomer) {
      toast.warn("Please select a customer");
      return;
    }

    if (selectedItems.length === 0) {
      toast.warn("Please add at least one item");
      return;
    }

    setLoading(true);
    try {
      const purchaseData = {
        customerId: selectedCustomer,
        items: selectedItems,
        totalAmount,
      };

      await salesService.createSale(purchaseData);
      toast.success("Purchase completed successfully!");
      setSelectedCustomer("");
      setSelectedItems([]);
      navigate("/sales");
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Failed to complete purchase"
        );
      } else {
        toast.error("An error occurred while processing your request");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    customers,
    items,
    selectedCustomer,
    selectedItems,
    totalAmount,
    loading,
    setSelectedCustomer,
    handleAddItem,
    handleQuantityChange,
    handleRemoveItem,
    handlePurchase,
  };
};
