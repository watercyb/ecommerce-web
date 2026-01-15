import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useEffect } from "react";

const CategoryPage = () => {
  const { category } = useParams();

  const { productsByCategory, isLoading, getProductsByCategory } = useProductStore();

  useEffect(() => {
    getProductsByCategory();
  }, [getProductsByCategory]);

  return <div>{category}</div>;
};

export default CategoryPage;
