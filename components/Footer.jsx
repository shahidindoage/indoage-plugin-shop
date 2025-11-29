"use client";

import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer({ logoUrl }) {
  return (
    <footer className="footer">
      {/* Top rows */}
      <div className="footer-rows">
        {/* Row 1 - Logo & Company */}
        <div className="footer-row">
          <div className="logo">
          {logoUrl ? <img src={logoUrl} alt="Logo" /> : <span>IndoAge</span>}
        </div>
          <p className="footer-company">At IndoAge, we are constantly evolving to bring you the latest and most effective digital marketing strategies tailored specifically for healthcare professionals. We know how important it is to stay informed about the best ways to reach and engage with your patients online.</p>
          
        </div>

        {/* Row 2 - Quick Links */}
        <div className="footer-row">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/downloads">Downloads</Link></li>
            <li><Link href="/myorders">Orders</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Row 3 - Office Hours */}
        <div className="footer-row">
          <h4>Office Hours</h4>
          <p>Monday - Friday 10 AM - 07 PM</p>
          <a href='mailto:info@indoage.ae' className="email">info@indoage.ae</a>
          
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} IndoAge. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://www.facebook.com/TheIndoAge/" target="_blank" rel="noopener noreferrer" className="links-socials"><FaFacebookF /></a>
          <a href="https://x.com/IndoAge/" target="_blank" rel="noopener noreferrer" className="links-socials"><FaTwitter /></a>
          <a href="https://www.instagram.com/indoage/" target="_blank" rel="noopener noreferrer" className="links-socials"><FaInstagram /></a>
          <a href="https://www.linkedin.com/company/indoage/" target="_blank" rel="noopener noreferrer" className="links-socials"><FaLinkedinIn /></a>
        </div>
      </div>

     
    </footer>
  );
}
