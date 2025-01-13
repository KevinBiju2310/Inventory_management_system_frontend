import { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import axiosInstance from "../services/axiosInstance";
import ConfirmationModal from "../Components/ConfirmationModal";
import { Search } from "lucide-react";

const Items = () => {
  const [itemDetails, setItemDetails] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/items");
        if (response.status == 200) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };
    fetchItems();
  }, []);

  const handleAddItem = () => {
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemDetails({ ...itemDetails, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setItemToEdit({ ...itemToEdit, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/additem", itemDetails);
      if (response.status == 201) {
        console.log("created Successfully");
        setItems((prevItems) => [...prevItems, response.data.newItem]);
      }
    } catch (error) {
      console.error("Error occurred", error);
    }
    setIsModalOpen(false);
  };

  const openConfirmModal = (itemId) => {
    setItemToDelete(itemId);
    setIsConfirmModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axiosInstance.put(`/edititem/${itemToEdit._id}`, {
        name: itemToEdit.name,
        description: itemToEdit.description,
        quantity: itemToEdit.quantity,
        price: itemToEdit.price,
      });
      if (response.status === 200) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === itemToEdit._id ? { ...item, ...itemToEdit } : item
          )
        );
        setIsEditModalOpen(false);
        setItemToEdit(null);
      }
    } catch (error) {
      console.log("Error Occured: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axiosInstance.delete(
        `/deleteitem/${itemToDelete}`
      );
      if (response.status === 200) {
        console.log("Deleted successfully");
        setItems(items.filter((item) => item._id !== itemToDelete));
      }
    } catch (error) {
      console.error("Error deleting item", error);
    }
    setIsConfirmModalOpen(false);
    setItemToDelete(null);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Items</h1>
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Add Item
        </button>
      </div>

      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search items by name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 ease-in-out hover:border-gray-300 text-gray-800 placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Table to display items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No items found</div>
          {searchTerm && (
            <div className="text-gray-400 text-sm">No results found</div>
          )}
        </div>
      ) : (
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
                  Quantity
                </th>
                <th className="border px-4 py-2 text-left font-medium text-gray-700">
                  Price
                </th>
                <th className="border px-4 py-2 text-left font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">INR {item.price}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openConfirmModal(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for adding items */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Item</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={itemDetails.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter item name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={itemDetails.description}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={itemDetails.quantity}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={itemDetails.price}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter price"
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update Item</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={itemToEdit.name}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter item name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={itemToEdit.description}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter description"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={itemToEdit.quantity}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={itemToEdit.price}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter price"
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
                  onClick={handleUpdate}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        message="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmModalOpen(false)}
      />
    </Layout>
  );
};

export default Items;
