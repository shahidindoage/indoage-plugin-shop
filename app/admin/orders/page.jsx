"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // for modal

  // Fetch all orders
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Fetch single order details
  const viewDetails = async (id) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
    }
  };

  const closeModal = () => setSelectedOrder(null);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Orders</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Name</th>
            <th>User Email</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ textAlign: "center" }}>
              <td>{order.id}</td>
              <td>{order.user?.name}</td>
              <td>{order.user?.email}</td>
              <td>₹{(order.totalCents / 100).toFixed(2)}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.paymentMethod}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <button
                  style={styles.viewBtn}
                  onClick={() => viewDetails(order.id)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedOrder && (
        <div style={styles.modalBackdrop} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>User:</strong> {selectedOrder.user?.name} (
              {selectedOrder.user?.email})
            </p>
            <p>
              <strong>Total:</strong> ₹{(selectedOrder.totalCents / 100).toFixed(2)}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <h3>Items</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item.id}>
                  {item.title} - Qty: {item.quantity} - ₹
                  {(item.priceCents / 100).toFixed(2)}
                </li>
              ))}
            </ul>

            <button style={styles.closeBtn} onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 20 },
  viewBtn: {
    padding: "5px 10px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#0070f3",
    color: "#fff",
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "500px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  closeBtn: {
    marginTop: 15,
    padding: "8px 12px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};
