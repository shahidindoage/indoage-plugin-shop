import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      priceCents,
      cloudinaryId,   // plugin file
      filename,       // plugin filename
      logoId,
      logoUrl,
      thumbnailId,
      thumbnailUrl,
    } = body;

    // Validate required fields
    if (!title || !priceCents || !cloudinaryId)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const product = await prisma.product.create({
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
        isPublished: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Create product failed:", error);
    return NextResponse.json({ error: "Product creation failed" }, { status: 500 });
  }
}
