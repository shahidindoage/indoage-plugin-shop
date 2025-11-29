import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out" });

  // Delete cookie by expiring it
  res.cookies.set("admin_logged_in", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // expire instantly
  });

  return res;
}
