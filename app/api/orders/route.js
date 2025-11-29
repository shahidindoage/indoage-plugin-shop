import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders
export async function POST(req) {
  try {
    const { userId, cart, address, paymentMethod } = await req.json();

    if (!userId) return NextResponse.json({ error: "User is required" }, { status: 400 });
    if (!cart || cart.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!address) return NextResponse.json({ error: "Address is required" }, { status: 400 });

  
    const totalCents = cart.reduce((sum, item) => sum + item.price * item.quantity * 100, 0);

  
    const order = await prisma.order.create({
      data: {
        userId,
        totalCents,
        paymentStatus: "pending", 
        paymentMethod,
        address,
        items: {
          create: cart.map((item) => ({
            productId: item.id || null,
            title: item.title,
            quantity: item.quantity,
            priceCents: Math.round(item.price * 100),
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
