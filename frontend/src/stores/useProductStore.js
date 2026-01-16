import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axios";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  productsByCategory: [],
  analyticsData: {
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  },
  dailySalesData: [],
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

  createProduct: async ({ name, description, price, image, category }) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/products/", {
        name,
        description,
        price,
        image,
        category,
      });
      set((state) => {
        return {
          products: [...state.products, res.data],
        };
      });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFeaturedProduct: async (id) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.patch(`/products/${id}`);

      set((state) => {
        return {
          products: state.products.map((p) => {
            if (p._id != res.data._id) {
              return p;
            } else {
              return res.data;
            }
          }),
        };
      });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ isLoading: true });
      await axiosInstance.delete(`/products/${id}`);

      set((state) => ({ products: state.products.filter((p) => p._id != id) }));
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  getAnalyticsData: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.get("/analytics");

      set({ analyticsData: res.data.analyticsData });
      set({ dailySalesData: res.data.dailySalesData });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },
}));
