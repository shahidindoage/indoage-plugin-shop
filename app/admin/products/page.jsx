"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products/list");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted!");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete product");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting product");
  }
};


  return (
    <div style={{ padding: 30 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>WordPress Premium Plugins</h1>
        <button
          onClick={() => router.push("/admin/products/create")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#2ecc71",
            color: "#fff",
            borderRadius: 5,
            border: "none",
            cursor: "pointer",
          }}
        >
          + Create Product
        </button>
      </div>

      <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 20 }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              width: 250,
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {p.thumbnailUrl && (
              <img
                src={p.thumbnailUrl}
                alt={`${p.title} Thumbnail`}
                style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 5 }}
              />
            )}
            {p.logoUrl && (
              <img
                src={p.logoUrl}
                alt={`${p.title} Logo`}
                style={{ width: 50, height: 50, objectFit: "contain", marginTop: 10 }}
              />
            )}

            <h2 style={{ marginTop: 10 }}>{p.title}</h2>
            <p>{p.description || "No description available."}</p>
            <p>
              <strong>Price:</strong> ₹{p.priceCents}
            </p>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <a
                href={`/admin/products/${p.id}/edit`}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#0070f3",
                  color: "#fff",
                  borderRadius: 5,
                  textDecoration: "none",
                  textAlign: "center",
                }}
              >
                Edit
              </a>

              <button
                onClick={() => handleDelete(p.id)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  backgroundColor: "#e74c3c",
                  color: "#fff",
                  borderRadius: 5,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
