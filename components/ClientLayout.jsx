"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import CartWrapper from "@/components/CartWrapper";
import Footer from "./Footer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const showHeader = !pathname.startsWith("/admin");

  return (
    <>
      {showHeader && <Header logoUrl="/logo.png" />}
      {children}
      <CartWrapper />
      {showHeader && <Footer logoUrl="/logo2.png" />}
    </>
  );
}
