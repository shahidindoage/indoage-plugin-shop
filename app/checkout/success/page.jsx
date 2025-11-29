"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useEffect } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎉 Payment Successful!</h1>
      <p style={styles.text}>
        Thank you for your purchase. Your order has been confirmed.
      </p>

      <div style={styles.buttons}>
        <button
          style={styles.btn}
          onClick={() => router.push("/myorders")}
        >
          View Orders
        </button>

        <button
          style={styles.btnSecondary}
          onClick={() => router.push("/shop1")}
        >
          Go to Shop
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "80px auto",
    textAlign: "center",
    padding: "30px",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  },
  title: { fontSize: 32, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 25, color: "#555" },
  buttons: { display: "flex", justifyContent: "center", gap: 15 },
  btn: {
    padding: "10px 18px",
    background: "#007bff",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 18px",
    background: "#444",
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  },
};
