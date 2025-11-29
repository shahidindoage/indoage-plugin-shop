// app/components/CartWrapper.js
"use client";

import CartSlider from "./CartSlider";
import { usePathname } from "next/navigation";

export default function CartWrapper() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/login") || pathname.startsWith("/register")) return null;
  return <CartSlider />;
}
