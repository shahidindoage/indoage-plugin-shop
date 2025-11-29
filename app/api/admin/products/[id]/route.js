import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Delete dependent rows first
    await prisma.license.deleteMany({ where: { productId: id } });
    await prisma.orderItem.deleteMany({ where: { productId: id } });

    // Delete the product
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product failed:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
