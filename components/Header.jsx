"use client";

import Link from "next/link";
import { useState, useContext } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { AuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Header({ logoUrl }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, setUser } = useContext(AuthContext);
const router=useRouter()
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "My Orders", href: "/myorders" },
    { name: "Downloads", href: "/downloads" },
  ];

  // Logout function
  const handleLogout = () => {
    // Clear cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";

    

    // // Hard refresh the page
    
router.push('/')
window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="container1">
        {/* Logo */}
        <Link className="logo" href="/">
          {logoUrl ? <img src={logoUrl} alt="Logo" /> : <span>IndoAge</span>}
        </Link>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          {/* Mobile Close Button */}
          <div className="close-btn" onClick={() => setMenuOpen(false)}>
            <FiX size={28} />
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Login / Logout Button */}
          {!user ? (
            <Link
              href="/login"
              className="login-btn"
              style={{background:'#005ea6',padding:"10px 15px",borderRadius:"10px",color:"white"}}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* Hamburger */}
        {!menuOpen && (
          <div className="hamburger" onClick={() => setMenuOpen(true)}>
            <FiMenu size={26} />
          </div>
        )}
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 4px 8px -4px rgba(0, 0, 0, 0.1);
          transition: 0.3s;
        }

        .container1 {
          max-width: 100%;
          width:100%;
          margin: auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          height: 70px;
        }

        .logo img {
          height: 50px;
          transition: transform 0.3s;
        }

        .logo img:hover {
          transform: scale(1.05);
        }

        .logo span {
          font-size: 28px;
          font-weight: 700;
          color: #2b8cd6;
        }

        .nav {
          display: flex;
          gap: 25px;
          align-items: center;
        }

        .nav-link {
          font-weight: 500;
          color: #6e6e6e;
          transition: 0.3s;
        }

        .nav-link:hover {
          color: #2b8bd6;
        }

        .login-btn {
          padding: 8px 14px;
          background: #2b8bd6;
          color: #fff;
          border-radius: 6px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-btn:hover {
          background: #29c2a8;
        }

        .hamburger,
        .close-btn {
          display: none;
          cursor: pointer;
          color: #2e2e2e;
        }

        .close-btn {
          margin-bottom: 20px;
        }

        /* Mobile sidebar */
        @media (max-width: 900px) {
          .nav {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            width: 100%;
            background: #ffffff;
            flex-direction: column;
            padding: 20px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: -2px 0 12px rgba(0, 0, 0, 0.08);
            z-index: 2000;
          }

          .nav.open {
            transform: translateX(0);
          }

          .nav-link,
          .login-btn {
            font-size: 18px;
          }

          .close-btn {
            display: block;
            align-self: flex-end;
            padding-right: 15px;
          }

          .hamburger {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
