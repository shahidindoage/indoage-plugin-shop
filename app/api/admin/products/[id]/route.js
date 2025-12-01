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
// PUT update product
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      title,
      description,
      priceCents,
      cloudinaryId,
      filename,
      logoId,
      logoUrl,
      thumbnailId,
      thumbnailUrl,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        priceCents: Number(priceCents),
        cloudinaryId,
        filename,
        logoId,
        logoUrl,
        thumbnailId,
        thumbnailUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update Error:", err);

    if (err.code === "P2025") {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Product update failed" }, { status: 500 });
  }
}