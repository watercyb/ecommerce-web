import { useEffect } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import { useProductStore } from "../stores/useProductStore";

const PeopleAlsoBought = () => {
  const { recommendations, isLoading, getRecommendations } = useProductStore();

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
