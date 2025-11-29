// app/api/license/deactivate/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to set CORS headers
function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, domain, productId } = body;

    if (!key || !domain || !productId) {
      const res = NextResponse.json(
        { valid: false, message: "License key, domain, and productId are required" },
        { status: 400 }
      );
      setCorsHeaders(res);
      return res;
    }

    const license = await prisma.license.findUnique({ where: { key } });

    if (!license) {
      const res = NextResponse.json({ valid: false, message: "License not found" }, { status: 404 });
      setCorsHeaders(res);
      return res;
    }

    if (license.productId !== productId) {
      const res = NextResponse.json({ valid: false, message: "License does not belong to this product" }, { status: 403 });
      setCorsHeaders(res);
      return res;
    }

    if (license.domain !== domain) {
      const res = NextResponse.json({ valid: false, message: "You can only deactivate from the registered domain" }, { status: 403 });
      setCorsHeaders(res);
      return res;
    }

    // Deactivate license (unset domain)
    await prisma.license.update({
      where: { key },
      data: { domain: null },
    });

    const res = NextResponse.json({ valid: true, message: "License deactivated successfully" });
    setCorsHeaders(res);
    return res;

  } catch (error) {
    console.error("License deactivation failed:", error);
    const res = NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

export async function OPTIONS() {
  const res = NextResponse.json({});
  setCorsHeaders(res);
  return res;
}
