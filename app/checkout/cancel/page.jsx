"use client";

import Link from "next/link";

export default function CancelPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>❌ Payment Cancelled</h1>
      <p style={styles.text}>
        Your payment was not completed. You can try again anytime.
      </p>

      <div style={styles.buttons}>
        <Link href="/cart">
          <button style={styles.btn}>Return to Cart</button>
        </Link>

        <Link href="/">
          <button style={styles.btnSecondary}>Go to Home</button>
        </Link>
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
    background: "#ff4a4a",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
  btnSecondary: {
    padding: "10px 18px",
    background: "#444",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  },
};
