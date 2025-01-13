import Layout from "../Components/Layout";
import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const Sales = () => {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState("cash");

  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get("/customers");
      if (response.status === 200) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axiosInstance.get("/items");
      if (response.status === 200) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

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
    fetchCustomers();
    fetchItems();
    fetchSales();
  }, []);

  const handleAddToCart = (itemId, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.item === itemId
      );
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.item === itemId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, { item: itemId, quantity }];
    });
  };

  const handleSubmit = async () => {
    try {
      const saleData = {
        customer: selectedCustomer,
        items: cart,
        paymentType,
      };
      const response = await axiosInstance.post("/sales", saleData);
      if (response.status === 201) {
        // setSales((prevSales) => [response.data.sale, ...prevSales]);
        setCart([]);
        setSelectedCustomer("");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Error occured: ", err);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Sales</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Purchase
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Sales List</h2>
      {sales.length === 0 ? (
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
              {sales.map((sale, index) => (
                <tr key={sale._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {sale.customer ? sale.customer.name : "Walk-in Customer"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <ul>
                      {sale.items.map((item, index) => (
                        <li key={index}>
                          {item.item?.name || "Unknown Item"} x {item.quantity}{" "}
                          (INR {item.price})
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
        </div>
      )}

      {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create Sale</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium">Customer</label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Walk-in Customer</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Items</label>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between mb-2"
                >
                  <span>{item.name}</span>
                  <div>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className="w-16 p-1 border border-gray-300 rounded mr-2"
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value, 10);
                        if (quantity > 0) {
                          handleAddToCart(item._id, quantity);
                        }
                      }}
                    />
                    <span className="text-sm text-gray-500">${item.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Payment Type</label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="cash">Cash</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Sales;
