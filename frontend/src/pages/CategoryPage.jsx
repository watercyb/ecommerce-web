import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useEffect } from "react";
import {motion as Motion} from "framer-motion"
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const CategoryPage = () => {
  const { category } = useParams();

  const { productsByCategory, isLoading, getProductsByCategory } =
    useProductStore();

  useEffect(() => {
    getProductsByCategory(category);
  }, [category, getProductsByCategory]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Motion.h1>

        <Motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {productsByCategory?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {productsByCategory?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
