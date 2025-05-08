import { useEffect, useState } from "react";
import { salesService } from "../services/salesService";

export const useSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await salesService.getSales();
      setSales(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch items");
      console.error("Error occured", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
  };
};
