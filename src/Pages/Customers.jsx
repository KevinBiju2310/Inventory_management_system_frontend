import { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import axiosInstance from "../services/axiosInstance";
import Pagination from "../Components/Pagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Customers = () => {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    address: "",
    mobileNumber: "",
  });
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await axiosInstance.get("/customers");
      if (response.status == 200) {
        setCustomers(response.data.customers);
      }
    };
    fetchCustomers();
  }, []);

  const handleAddCustomers = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const { name, address, mobileNumber } = customerDetails;
    if (!name.trim() || !address.trim() || !mobileNumber) {
      toast.error("All fields are required");
      return;
    }
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobileNumber)) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }
    try {
      const response = await axiosInstance.post(
        "/addcustomer",
        customerDetails
      );
      if (response.status == 201) {
        console.log(response.data.message);
        setCustomers((prevCustomers) => [
          ...prevCustomers,
          response.data.newCustomer,
        ]);
      }
    } catch (error) {
      console.error("Error Occured: ", error);
    }
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={handleAddCustomers}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Add Customers
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left font-medium text-gray-700">
                Index
              </th>
              <th className="border px-4 py-2 text-left font-medium text-gray-700">
                Name
              </th>
              <th className="border px-4 py-2 text-left font-medium text-gray-700">
                Mobile Number
              </th>
              {/* <th className="border px-4 py-2 text-left font-medium text-gray-700">
                Action
              </th> */}
            </tr>
          </thead>
          <tbody>
            {currentCustomers.map((customer, index) => (
              <tr
                key={customer._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{customer.name}</td>
                <td className="border px-4 py-2">{customer.mobileNumber}</td>
                {/* <td className="border px-4 py-2">
                  <button
                    // onClick={() => handleEditItem(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    // onClick={() => openConfirmModal(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(customers.length / customersPerPage)}
          onPageChange={handlePageChange}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerDetails.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter customer name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={customerDetails.address}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Address"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Mobile Number
                </label>
                <input
                  type="number"
                  name="mobileNumber"
                  value={customerDetails.mobileNumber}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Mobile Number"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Customers;
