
import { useState } from "react";
import { useRazorpay } from "react-razorpay";

const BaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5500').trim().replace(/\/+$/, '');

export default function PaymentButton() {
  const { Razorpay } = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    try {
      // 1. Create order through Express
      const orderResponse = await fetch(
        `${BaseUrl}/pay`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 1 * 100 = 100 paise
          body: JSON.stringify({ amount: 100 }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Could not create payment order");
      }

      const order = await orderResponse.json();

      // 2. Open Razorpay's hosted checkout
      const checkout = new Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Don",
        description: "Test payment",
        order_id: order.id,

        handler: async (response) => {
          try {
            // 3. Verify signature through Express
            const verifyResponse = await fetch(
              `${BaseUrl}/payment/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              }
            );

            const result = await verifyResponse.json();

            if (!verifyResponse.ok || !result.success) {
              throw new Error("Payment verification failed");
            }

            setMessage("Payment verified successfully!");
          } catch (error) {
            setMessage(error.message);
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      checkout.on("payment.failed", () => {
        setMessage("Payment failed. Please try again.");
        setLoading(false);
      });

      checkout.open();
    } catch (error) {
      setMessage(error.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="px-6 py-2 border rounded-2xl bg-indigo-500 text-white cursor-pointer active:scale-[0.98]" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay ₹1"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}
