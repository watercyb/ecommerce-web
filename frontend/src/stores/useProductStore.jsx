import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  productsByCategory: [],
  isLoading: false,

  getProducts: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/products");
      set({ products: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  getFeaturedProducts: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/products/featured");
      set({ featuredProducts: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  getProductsByCategory: async (category) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get(`/products/${category}`);
      set({ productsByCategory: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },
}));
