"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/components/FullPageLoader";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/admin/dashboard"); // redirect after login
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          width: 300,
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>
          Login
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: 15,
  borderRadius: 5,
  border: "1px solid #ccc",
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};
