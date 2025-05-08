import axiosInstance from "./axiosInstance";

export const authService = {
  signIn: async (userData) => {
    const response = await axiosInstance.post("/signin", userData);
    return response
  },
};
