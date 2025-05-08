import { useState } from "react";
// import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { setUser } from "../Redux/userSlice";
import { useDispatch } from "react-redux";

export const useAuth = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (userData) => {
    try {
      const { email, password } = userData;

      if (!email.trim() || !password.trim()) {
        setError("All fields are required");
        return 400;
      }
      const response = await authService.signIn(userData);

      if (response.status === 200) {
        dispatch(setUser(response.data.user));
        setError(null);
      } 
      return response.status;
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError("Password is incorrect");
        } else if (status === 404) {
          setError("User not found");
        } else {
          setError("Something went wrong. Please try again later.");
        }
        return status;
      } else {
        setError("Network error. Please check your connection.");
        return 500;
      }
    }
  };

  return {
    error,
    handleSubmit,
  };
};
