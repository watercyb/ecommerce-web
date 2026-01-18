import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";
import { useCartStore } from "./useCartStore";

export const useUserStore = create((set) => ({
  user: null,
  isLoading: false,

  signup: async ({ name, email, password, confirmPassword }) => {
    try {
      set({ isLoading: true });
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
      set({ isLoading: false });
    }
  },

  getUser: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/auth/user");
      set({ user: res.data });
      useCartStore.getState().setCart(res.data.cartItems);
    } catch (error) {
      console.log(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ isLoading: true });
      if (!email || !password) return toast.error("Please fill all blocks");
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data });
      useCartStore.getState().setCart(res.data.cartItems);
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
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

  refresh: async () => {
    try {
      await axiosInstance.post("/auth/refresh");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
