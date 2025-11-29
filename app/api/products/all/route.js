import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    let products;

    if (location && location.trim() !== "") {
      // Filter products by location (string match)
      products = await prisma.product.findMany({
        where: {
          location: location,
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Return all products
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Product Fetch Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
