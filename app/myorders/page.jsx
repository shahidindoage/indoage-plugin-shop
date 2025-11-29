"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      const res = await fetch(`/api/orders/user/${user.id}`);
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  if (!user)
    return <p className="center-text">Please login to view your orders.</p>;
  if (loading) return <div style={{height:"500px",display:"flex",justifyContent:'center',alignItems:'center'}}><p className="center-text" style={{fontSize:"25px",fontWeight:800}}>Loading orders...</p></div> ;


  const openKeyPopup = (key) => {
    setActiveKey(key);
    setCopied(false);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setActiveKey("");
  };

  const copyKey = async () => {
    await navigator.clipboard.writeText(activeKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="orders-page">
      
    { orders.length !== 0 && <h1>Your Orders</h1>}

      {orders.length === 0 && <div style={{height:"220px",display:"flex",justifyContent:'center',alignItems:'center'}}><p className="center-text" style={{fontSize:"25px",fontWeight:800}}>No Orders yet.</p></div>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.id.slice(0, 6).toUpperCase()}</h3>
              <span className={`status ${order.paymentStatus.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </div>

            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Total:</strong> ₹{order.totalCents / 100}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

          
          </div>
        ))}
      </div>

     

      <style jsx>{`
        .orders-page {
          max-width: 900px;
          margin: 40px auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 28px;
          font-weight: 600;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: #fff;
          padding: 25px 20px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.07);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .order-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .order-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .status {
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #fff;
        }

        .status.paid { background: #4caf50; }
        .status.pending { background: #ff9800; }
        .status.failed { background: #d32f2f; }

        .order-card p {
          margin: 6px 0;
          font-size: 14px;
          color: #555;
        }

        .show-key-btn {
          margin-top: 15px;
          background: #0077b6;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
        }
        .show-key-btn:hover {
          background: #005f8c;
        }

        /* Popup */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-box {
          background: #fff;
          padding: 25px;
          border-radius: 12px;
          width: 350px;
          text-align: center;
          animation: fadeIn 0.25s ease;
        }
        .key-text {
          font-size: 18px;
          font-weight: bold;
          background: #f1f1f1;
          padding: 12px;
          border-radius: 6px;
          margin: 15px 0;
          word-break: break-all;
        }
        .copy-btn {
          background: #4caf50;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 10px;
          transition: 0.2s;
        }
        .copy-btn:hover { background: #3e8e41; }

        .close-btn {
          background: #d32f2f;
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.2s;
        }
        .close-btn:hover { background: #b71c1c; }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .center-text {
          text-align: center;
          margin-top: 50px;
          font-size: 16px;
          color: #555;
        }

        @media(max-width: 600px) {
          .order-card {
            padding: 20px 15px;
          }
          .popup-box {
            width: 90%;
          }
        }
      `}</style>
    </div>
  );
}
