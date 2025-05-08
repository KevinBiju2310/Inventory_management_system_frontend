import Layout from "../Components/Layout";
import { usePurchase } from "../Hooks/usePurchase";

const Purchase = () => {
  const {
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
  } = usePurchase();

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">New Purchase</h1>

        {loading && <div className="text-center py-4">Loading data...</div>}

        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Customer
          </label>
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            disabled={loading}
          >
            <option value="">Select a Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Item Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Select Item
          </label>
          <select
            onChange={(e) => handleAddItem(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            disabled={loading}
          >
            <option value="">Choose an Item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - INR {item.price}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Items List */}
        {selectedItems.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Selected Items</h2>
            <table className="table-auto w-full border-collapse border border-gray-300 text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">
                    Item Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Total</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.itemId}>
                    <td className="border border-gray-300 px-4 py-2">
                      {item.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      INR {item.price}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.itemId,
                            parseInt(e.target.value)
                          )
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                        className="border border-gray-300 rounded p-1 w-16 text-center"
                        disabled={loading}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      INR {item.price * item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Amount */}
            <div className="text-right font-bold text-lg mt-4">
              Total Amount: INR {totalAmount}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handlePurchase}
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || !selectedCustomer || selectedItems.length === 0}
        >
          {loading ? "Processing..." : "Purchase"}
        </button>
      </div>
    </Layout>
  );
};

export default Purchase;
