import axiosInstance from "./axiosInstance";

export const customerService = {
  getCustomers: async () => {
    const response = await axiosInstance.get("/customers");
    return response.data.customers;
  },

  addCustomer: async (customerData) => {
    const response = await axiosInstance.post("/addcustomer", customerData);
    return response.data;
  },
};
