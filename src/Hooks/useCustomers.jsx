import { useState, useEffect } from "react";
import { customerService } from "../services/customerService";
import { toast } from "react-toastify";

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch customers");
      console.error("Error fetching customers: ", err);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const { name, address, mobileNumber } = customerData;
      if (!name.trim() || !address.trim() || !mobileNumber) {
        toast.error("All fields are required");
        return false;
      }

      const mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(mobileNumber)) {
        toast.error("Mobile number must be exactly 10 digits");
        return false;
      }

      const response = await customerService.addCustomer(customerData);
      setCustomers((prevCustomers) => [...prevCustomers, response.newCustomer]);
      return true;
    } catch (err) {
      console.error("Error adding customer:", err);
      toast.error("Failed to add customer");
      return false;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
  };
};
