import { NextResponse } from "next/server";

// Customer-protected routes
const customerProtectedRoutes = ["/shop", "/checkout", "/product","/myorders","/downloads","/contact"];

// Admin-protected routes
const adminProtectedRoutes = ["/admin"];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ---------------------------
  // 1. Admin routes protection
  // ---------------------------
  const isAdminRoute = adminProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute && pathname !== "/admin-login") {
    const adminCookie = req.cookies.get("admin_logged_in")?.value;
    if (adminCookie !== "true") {
      const loginUrl = new URL("/admin-login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ---------------------------
  // 2. Customer routes protection
  // ---------------------------
  const isCustomerRoute = customerProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isCustomerRoute) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Optional: verify JWT here
    // jwt.verify(token, process.env.JWT_SECRET)
  }

  // ---------------------------
  // 3. Allow all other routes
  // ---------------------------
  return NextResponse.next();
}

// Apply middleware to admin and customer routes
export const config = {
  matcher: [
    "/shop",
    "/checkout",
    "/product/:path*",
    "/admin/:path*",
    "/myorders",
    "/downloads",
    "/contact"
  ],
};
