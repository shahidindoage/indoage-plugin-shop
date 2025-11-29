
"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  if (!address.trim()) return alert("Please enter delivery address");
  if (!user) return alert("Please login");

  console.log(user)
  setLoading(true);
  try {
    const res = await fetch("/api/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cart,
    userId: user.id,
    address,
  }),
});


    const data = await res.json();

    if (res.ok) {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to initiate payment");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (user?.email) {
    setAddress(user.email);
  }
}, [user]);



  if (cart.length === 0)
    return <p className="center-text">Your cart is empty</p>;

  return (
    <div className="checkout-page">
      <h1 style={{color:"#2d8dd6"}}>Checkout</h1>
      <div className="checkout-container">
        <div className="cart-summary">
          <h2>Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.logoUrl || "/placeholder.png"} alt={item.title} />
              <div className="item-info">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
              </div>
            </div>
          ))}
          <div className="total">
            <strong>Total:</strong> ₹{total}
          </div>
        </div>

        <div className="checkout-form">
          
         <label className="input-label">
  Email Address:
  <input
    type="email"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
    placeholder="Enter your email address"
    defaultValue={user?.email || ""}
    className="email-input"
  />
  <p className="info-text">
    Provide the correct email address where you want to receive the plugin and license key.
  </p>
</label>


          <button onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Redirecting to Payment..." : "Pay with Stripe"}
          </button>
        </div>
      </div>

       <style jsx>{`
        .checkout-page {
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 20px;
        }
        h1 {
          text-align: center;
          margin-bottom: 30px;
        }
        .checkout-container {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }
        .cart-summary, .checkout-form {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          flex: 1 1 400px;
        }
        .cart-summary h2, .checkout-form h2 {
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .cart-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        .cart-item img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          margin-right: 15px;
          object-fit: cover;
        }
        .item-info h3 {
          margin: 0;
          font-size: 16px;
        }
        .item-info p {
          margin: 4px 0 0;
          color: #555;
        }
        .total {
          margin-top: 20px;
          font-size: 18px;
          font-weight: bold;
        }
        .checkout-form label {
          display: block;
          margin-bottom: 15px;
          font-weight: 500;
        }
        .checkout-form textarea {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          resize: none;
          min-height: 80px;
        }
        .checkout-form select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
        }
        .checkout-form button {
          margin-top: 15px;
          width: 100%;
          padding: 12px;
          background-color: #0077b6;
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .checkout-form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .center-text {
          text-align: center;
          margin-top: 50px;
          font-size: 18px;
          color: #555;
        }

        @media(max-width: 768px) {
          .checkout-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
