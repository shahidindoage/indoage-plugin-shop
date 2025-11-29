import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req) => {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Product Delete Error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
};
