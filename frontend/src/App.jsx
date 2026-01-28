import { Route, Router, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CategoryPage from "./pages/CategoryPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

const App = () => {
  const { user, isLoading, getUser } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  console.log(import.meta.env.VITE_URL);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <HomePage />}
          />
          <Route path="/login" element={!user ? <LoginPage /> : <HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/secret-dashboard"
            element={user?.role === "admin" ? <AdminPage /> : <LoginPage />}
          />
          <Route path="/cart" element={user ? <CartPage /> : <LoginPage />} />
          <Route
            path="/payments/purchase-success"
            element={<PurchaseSuccessPage />}
          />
          <Route
            path="/payments/purchase-cancel"
            element={<PurchaseCancelPage />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
