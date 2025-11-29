import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        items: {
          include: {
            product: {
              select: { id: true, title: true, cloudinaryId: true },
            },
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("Fetch orders failed:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
