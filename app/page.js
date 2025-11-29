"use client";

import Link from "next/link";
import { FiCpu, FiShield, FiZap, FiHeadphones } from "react-icons/fi";

export default function PluginLandingPage() {
  return (
    <div className="landing">

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Supercharge Your WordPress Site</h1>
          <p className="hero-sub">
            Premium, secure, and feature‑rich plugins to boost your website functionality instantly.
          </p>
          <Link href="/shop" className="cta-btn">Browse Plugins</Link>
        </div>
        <div className="hero-image">
          <img 
            src="https://static.vecteezy.com/system/resources/previews/020/975/579/non_2x/wordpress-logo-wordpress-icon-transparent-free-png.png" 
            alt="WordPress plugin illustration" 
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Why Choose Our Plugins</h2>
        <div className="feature-grid">
          <div className="feature">
            <FiCpu className="feature-icon" />
            <h3>Easy to Use</h3>
            <p>No coding required — just install and activate instantly.</p>
          </div>
          <div className="feature">
            <FiShield className="feature-icon" />
            <h3>Secure & Updated</h3>
            <p>Regular updates with security patches to keep your site safe.</p>
          </div>
          <div className="feature">
            <FiZap className="feature-icon" />
            <h3>Performance Optimized</h3>
            <p>Lightweight and blazing fast, ensuring smooth user experience.</p>
          </div>
          <div className="feature">
            <FiHeadphones className="feature-icon" />
            <h3>Premium Support</h3>
            <p>Dedicated support whenever you need assistance.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to upgrade your site?</h2>
        <p>Start using premium plugins that enhance functionality and performance.</p>
        <Link href="/shop" className="cta-primary">Get Started Now</Link>
      </section>

    </div>
  );
}
