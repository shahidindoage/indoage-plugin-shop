// app/api/license/check/route.js
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
    const { key, productId, domain } = body;

    if (!key || !productId || !domain) {
      const res = NextResponse.json(
        { valid: false, message: "License key, productId, and domain are required" },
        { status: 400 }
      );
      setCorsHeaders(res);
      return res;
    }

    // Find license in database
    const license = await prisma.license.findUnique({ where: { key } });

    if (!license || !license.isActive) {
      const res = NextResponse.json({ valid: false, message: "Worng License key Entered" });
      setCorsHeaders(res);
      return res;
    }

    // Check that license belongs to this product
    if (license.productId !== productId) {
      const res = NextResponse.json({ valid: false, message: "License does not belong to this product" });
      setCorsHeaders(res);
      return res;
    }

    // Check if license is already used on another domain
    if (license.domain && license.domain !== domain) {
      const res = NextResponse.json({ valid: false, message: `License is already used on another site` });
      setCorsHeaders(res);
      return res;
    }

    // Update domain if not already set
    if (!license.domain) {
      await prisma.license.update({
        where: { key },
        data: { domain },
      });
    }

    const res = NextResponse.json({
      valid: true,
      message: "License is valid",
      productId: license.productId,
    });
    setCorsHeaders(res);
    return res;

  } catch (error) {
    console.error("License check failed:", error);
    const res = NextResponse.json({ valid: false, message: "Server error" }, { status: 500 });
    setCorsHeaders(res);
    return res;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  const res = NextResponse.json({});
  setCorsHeaders(res);
  return res;
}
