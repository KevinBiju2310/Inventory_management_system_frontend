import axiosInstance from "./axiosInstance";

export const salesService = {
  getSales: async () => {
    const response = await axiosInstance.get("/sales");
    return response.data.sales;
  },

  createSale: async (purchaseData) => {
    const response = await axiosInstance.post("/sales", purchaseData);
    return response.data;
  },
};
