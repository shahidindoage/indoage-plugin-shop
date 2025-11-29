"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../contexts/CartContext";

export default function CartSlider() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggleCart = () => setOpen(!open);

  const handleCheckout = () => {
    router.push("/checkout");
    setOpen(false); // close cart slider
  };

  return (
    <>
      {/* Cart Button */}
      <button className="cart-btn" onClick={toggleCart}>
        🛒 Cart ({cart.length})
      </button>

      {/* Overlay */}
      <div
        className={`cart-overlay ${open ? "open" : ""}`}
        onClick={toggleCart}
      ></div>

      {/* Cart Drawer */}
      <div className={`cart-slider ${open ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={toggleCart}>
            ×
          </button>
        </div>

        <div className="cart-items"> 
          {cart.length === 0 && <p>Your cart is empty.</p>}

          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              {/* Product Logo */}
              {item.logoUrl && (
                <img
                  src={item.logoUrl}
                  alt={item.title + " Logo"}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "contain",
                    marginRight: 10,
                    borderRadius: 5,
                  }}
                />
              )}

              <div className="item-info">
                <h3>{item.title}</h3>
                <p>
                  ₹{item.price}
                </p>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <p className="total">Total: ₹{total}</p>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-btn {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          color: #fff;
          border: none;
          cursor: pointer;
         
        }

        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s;
          z-index: 999;
        }
        .cart-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .cart-slider {
          position: fixed;
          top: 0;
          right: -400px;
          width: 350px;
          height: 100%;
          background: #fff;
          box-shadow: -4px 0 10px rgba(0,0,0,0.1);
          transition: right 0.3s;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }
        .cart-slider.open {
          right: 0;
        }

        .cart-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }

        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .item-info h3 {
          margin: 0;
          font-size: 16px;
        }

        .item-info p {
          margin: 4px 0 0;
          color: #555;
        }

        .remove-btn {
          margin-left: auto;
          background: none;
          border: none;
          color: red;
          font-size: 18px;
          cursor: pointer;
        }

        .cart-footer {
          padding: 20px;
          border-top: 1px solid #eee;
        }

        .checkout-btn, .clear-btn {
          width: 100%;
          padding: 12px;
          margin-top: 10px;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
        }

        .checkout-btn {
          background: #0070f3;
          color: #fff;
        }

        .clear-btn {
          background: #eee;
          color: #333;
        }
      `}</style>
    </>
  );
}
