"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) return <p className="center-text">Please login to view your downloads.</p>;
if (loading) return <div style={{height:"500px",display:"flex",justifyContent:'center',alignItems:'center'}}><p className="center-text" style={{fontSize:"25px",fontWeight:800}}>Loading downloads...</p></div> ;

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
    <div className="downloads-page">
      { orders.length !== 0 && <h1>Your Downloads</h1>}

      {orders.length === 0 && <div style={{height:"220px",display:"flex",justifyContent:'center',alignItems:'center'}}><p className="center-text" style={{fontSize:"25px",fontWeight:800}}>No Downloads yet.</p></div>}

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            {order.items.map((item) => (
              <div className="order-item" key={item.id}>
                {/* LEFT: Logo + Title + Price */}
                <div className="item-left">
                  <div className="item-thumb">
                    <img src={item.logoUrl || "/placeholder.png"} alt={item.title} />
                  </div>
                  <div className="item-info">
                    <p className="item-title">{item.title}</p>
                  </div>
                </div>

                {/* RIGHT: Buttons */}
                <div className="item-buttons">
                  {item.licenseKey && (
                    <button
                      onClick={() => openKeyPopup(item.licenseKey)}
                      className="show-key-btn"
                    >
                      Show License Key
                    </button>
                  )}
                  {item.downloadLink && (
                    <a
                      href={item.downloadLink}
                      className="download-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-box" onClick={(e) => e.stopPropagation()}>
            <h3>License Key</h3>
            <p className="key-text">{activeKey}</p>
            <button className="copy-btn" onClick={copyKey}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            <button className="close-btn" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .downloads-page {
          max-width: 1000px;
          margin: 40px auto;
          padding: 20px;
        }

        h1 {
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 40px;
          color: #111;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .order-card {
          background: #fff;
          border-radius: 15px;
          padding: 20px 25px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          transition: 0.2s;
        }
        .order-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #f0f0f0;
          flex-wrap: wrap;
        }
        .order-item:last-child {
          border-bottom: none;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .item-thumb img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          object-fit: cover;
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .item-title {
          font-weight: 600;
          font-size: 20px;
          margin: 0 0 5px 0;
        }

        .item-price {
          font-size: 14px;
          color: #555;
        }

        .item-buttons {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .show-key-btn {
          background: #ff9800;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          font-size: 14px;
          transition: 0.2s;
        }
        .show-key-btn:hover {
          background: #e68900;
        }

        .download-btn {
          background-color: #0077b6;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          transition: 0.2s;
          width:200px;
          text-align:center;
        }
        .download-btn:hover {
          background-color: #005f8c;
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
          background: white;
          padding: 30px;
          border-radius: 15px;
          width: 380px;
          text-align: center;
          animation: fadeIn 0.25s ease;
        }
        .key-text {
          font-size: 18px;
          font-weight: bold;
          background: #f9f9f9;
          padding: 14px;
          border-radius: 8px;
          margin: 20px 0;
          word-break: break-all;
        }
        .copy-btn {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 10px;
          transition: 0.2s;
        }
        .copy-btn:hover { background: #3e8e41; }

        .close-btn {
          background: #d32f2f;
          color: white;
          border: none;
          padding: 10px 18px;
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
          .order-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .item-buttons {
            width: 100%;
          }
          .download-btn {
            width: 92%;
          }
        }
      `}</style>
    </div>
  );
}
