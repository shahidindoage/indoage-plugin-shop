import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password required" }, { status: 400 });
  }

  // Check against environment variables
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    // Set a simple cookie for session
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_logged_in", "true", { path: "/", httpOnly: true });
    return res;
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}

export async function GET(req) {
  const cookie = req.cookies.get("admin_logged_in")?.value;
  return NextResponse.json({ loggedIn: cookie === "true" });
}
