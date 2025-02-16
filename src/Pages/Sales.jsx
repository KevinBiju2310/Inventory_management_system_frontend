import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
import Pagination from "../Components/Pagination";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [salesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchSales = async () => {
    try {
      const response = await axiosInstance.get("/sales");
      if (response.status == 200) {
        setSales(response.data.sales);
      }
    } catch (error) {
      console.error("Error occured:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const filteredSales = sales.filter((sale) => {
    const customerName = sale.customer
      ? sale.customer.name.toLowerCase()
      : "walk-in customer";
    const items = sale.items
      .map((item) => item.itemId?.name?.toLowerCase() || "unknown item")
      .join(" ");
    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      items.includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          onClick={() => navigate("/purchase")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Purchase
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search by customer or item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Sales List</h2>
      {currentSales.length === 0 ? (
        <p>No sales available</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300 text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Sr.No</th>
                <th className="border border-gray-300 px-4 py-2">Customer</th>
                <th className="border border-gray-300 px-4 py-2">Items</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">
                  Payment Type
                </th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {currentSales.map((sale, index) => (
                <tr key={sale._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {indexOfFirstSale + index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {sale.customer ? sale.customer.name : "Walk-in Customer"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul>
                      {sale.items.map((item, index) => (
                        <li key={index}>
                          {item.itemId?.name || "Unknown Item"} x{" "}
                          {item.quantity} (INR {item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    INR {sale.total}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {sale.paymentType}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(sale.date).toLocaleDateString("in")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredSales.length / salesPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </Layout>
  );
};

export default Sales;
