"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-details">
      <h1>Order #{order.id}</h1>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>
      <p><strong>Delivery Address:</strong> {order.address}</p>
      <h2>Items:</h2>
      <ul>
        {order.items.map(item => (
          <li key={item.id}>
            {item.name} - ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
          </li>
        ))}
      </ul>
      <p><strong>Customer:</strong> {order.customer?.name} ({order.customer?.email})</p>
    </div>
  );
}
