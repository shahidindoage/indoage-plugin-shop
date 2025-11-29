"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "../contexts/CartContext";

export default function ProductsDashboard() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      alert("Added to cart!");
    }
  };

  if (loading) return <div style={styles.center}>Loading product...</div>;
  if (!product) return <div style={styles.center}>Product not found</div>;

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => router.push("/shop")}>
        ← Back to Shop
      </button>

      <div style={styles.card}>
        <div style={styles.imageContainer}>
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            style={styles.image}
          />
        </div>

        <div style={styles.info}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>₹{product.price}</p>
          <p style={styles.description}>
            {product.description ||
              "Fresh fish delivered straight to your door. Perfect for meals!"}
          </p>

          <button style={styles.addBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles= {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  center: {
    textAlign: "center",
    padding: 50,
    fontSize: 18,
    color: "#555",
  },
  backBtn: {
    backgroundColor: "#fff",
    color: "#0077b6",
    padding: "8px 14px",
    borderRadius: 6,
    border: "1px solid #0077b6",
    cursor: "pointer",
    marginBottom: 20,
  },
  card: {
    display: "flex",
    flexWrap: "wrap",
    gap: 30,
    backgroundColor: "#f6fbff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  imageContainer: {
    flex: 1,
    minWidth: 280,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    maxWidth: 300,
    borderRadius: 12,
    objectFit: "cover",
  },
  info: {
    flex: 1,
    minWidth: 280,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#ff7f50",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: 600,
    color: "#0077b6",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    lineHeight: 1.5,
  },
  addBtn: {
    backgroundColor: "#ff7f50",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },
};
