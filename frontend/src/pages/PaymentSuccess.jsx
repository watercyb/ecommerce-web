import { useSearchParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { isLoading, checkPayment } = useCartStore();

  useEffect(() => {
    checkPayment(sessionId);
  }, [checkPayment, sessionId]);

  if (!sessionId) return <div>Unsuccess</div>;

  if (isLoading) return <div>Waiting for server</div>;

  return <div>PaymentSuccess</div>;
};

export default PaymentSuccess;
