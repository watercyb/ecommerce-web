import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,

  signup: async ({ name, email, password, confirmPassword }) => {
    try {
      set({ loading: true });
      if (!name || !email || !password || !confirmPassword)
        return toast.error("Please fill all blocks");
      if (password !== confirmPassword)
        return toast.error("Passwords do not match");

      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });

      set({ user: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  getUser: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/auth/user");

      set({ user: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ loading: true });
      if (!email || !password) return toast.error("Please fill all blocks");

      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log(res.data);

      set({ user: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
