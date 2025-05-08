import axiosInstance from "./axiosInstance";

export const itemService = {
  getItems: async () => {
    const response = await axiosInstance.get("/items");
    return response.data.items;
  },

  addItem: async (itemData) => {
    const response = await axiosInstance.post("/additem", itemData);
    return response.data;
  },

  updateItem: async (itemId, itemData) => {
    const response = await axiosInstance.put(`/edititem/${itemId}`, itemData);
    return response.data;
  },

  deleteItem: async (itemId) => {
    const response = await axiosInstance.delete(`/deleteitem/${itemId}`);
    return response.data;
  },
};
