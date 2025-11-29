"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "⚙️" },
    { name: "Orders", href: "/admin/orders", icon: "💵" },
    { name: "License", href: "/admin/licenses", icon: "🔑" },
    { name: "Users", href: "/admin/users", icon: "👥" },
  ];

  const isActive = (path) => pathname === path;

  // -------------------
  // LOGOUT FUNCTION
  // -------------------
  const handleLogout = async () => {
  await fetch("/api/admin/logout", {
    method: "POST",
  });

  router.push("/admin-login");
};


  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? 220 : 0,
          backgroundColor: "#ff7043",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: sidebarOpen ? 20 : 0,
          overflow: "hidden",
          transition: "width 0.3s ease, padding 0.3s ease",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1000,
          boxShadow: sidebarOpen && !isMobile ? "2px 0 6px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {isMobile && sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              alignSelf: "flex-end",
              marginBottom: 20,
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}

        <h2
          style={{
            marginBottom: 30,
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: 1,
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          🛒 Shop
        </h2>

        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              padding: "10px 14px",
              marginBottom: 12,
              borderRadius: 8,
              backgroundColor: isActive(link.href) ? "#f4511e" : "transparent",
              opacity: sidebarOpen ? 1 : 0,
              transition: "all 0.3s ease",
            }}
          >
            <span>{link.icon}</span>
            {link.name}
          </Link>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            padding: "10px 14px",
            backgroundColor: "#d84315",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: 16,
            opacity: sidebarOpen ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main content */}
      <main
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: "#fff3e0",
          transition: "margin-left 0.3s ease",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              marginBottom: 20,
              padding: "10px 14px",
              fontSize: 22,
              backgroundColor: "#ff7043",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            ☰
          </button>
        )}

        {children}
      </main>
    </div>
  );
}
