/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Home, Users, Box, ShoppingCart, LogOut } from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useDispatch } from "react-redux";
import { logOut } from "../Redux/userSlice";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();

  const navItems = [
    { icon: Home, label: "Dashboard", to: "/dashboard" },
    { icon: Box, label: "Items", to: "/items" },
    { icon: Users, label: "Customers", to: "/customers" },
    { icon: ShoppingCart, label: "Sales", to: "/sales" },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logOut());
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-yellow-500 border-b border-gray-200 h-16 flex items-center px-4 justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-semibold ml-4">
            Inventory Management System
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add header actions here */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 ease-in-out bg-gray-200 border-r border-gray-200 overflow-hidden`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
