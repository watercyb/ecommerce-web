import { useCartStore } from "../stores/useCartStore";
import { motion as Motion } from "framer-motion";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import EmptyCart from "../components/EmptyCart";
import { useEffect } from "react";

const CartPage = () => {
  const { cart, calculateTotals } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-7xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <Motion.div
            className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            )}
            {cart.length > 0 && <PeopleAlsoBought />}
          </Motion.div>

          {cart.length > 0 && (
            <Motion.div
              className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <OrderSummary />
              <GiftCouponCard />
            </Motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartPage;
