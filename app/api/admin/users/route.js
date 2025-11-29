import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        // optionally include counts of products/orders/licenses
        _count: {
          select: { products: true, orders: true, License: true },
        },
      },
    });
    return NextResponse.json(users);
  } catch (err) {
    console.error("Fetch users failed:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
