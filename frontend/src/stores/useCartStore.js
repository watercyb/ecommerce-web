import { create } from "zustand";
import axiosInstance from "../utils/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  isLoading: false,

  addToCart: async (product) => {
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item.product._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            )
          : [...prevState.cart, { product, quantity: 1 }];
        return { cart: newCart };
      });

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  updateQuantity: async (id, delta) => {
    try {
      const quantity =
        get().cart.find((item) => item.product._id === id).quantity + delta;
      if (quantity === 0) {
        get().removeFromCart(id);
        return;
      }

      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item.product._id === id ? { ...item, quantity: quantity } : item,
        ),
      }));
      await axiosInstance.put(`/cart/${id}`, { delta });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item.product._id === id
            ? { ...item, quantity: item.quantity - delta }
            : item,
        ),
      }));
    }
  },

  removeFromCart: async (productId) => {
    await axiosInstance.delete(`/cart`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item.product._id !== productId),
    }));
    get().calculateTotals();
  },

  applyCoupon: async (code) => {
    try {
      if (!code) return;
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },

  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data });
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  checkPayment: async (sessionId) => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post("/payments/checkout-success", {
        sessionId,
      });
      console.log(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  checkOut: async () => {
    try {
      set({ isLoading: true });
      const res = await axiosInstance.post(
        "/payments/create-checkout-session",
        {
          products: get().cart,
          couponCode: get().isCouponApplied ? get().coupon.code : null,
        },
      );
      return res.data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ isLoading: false });
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },

  setCart: (cart) => {
    set({ cart });
  },
}));
