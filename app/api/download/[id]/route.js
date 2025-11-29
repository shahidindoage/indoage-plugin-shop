import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import fetch from "node-fetch";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req, { params }) {
  const { id } = params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  try {
    const resource = await cloudinary.api.resource(product.cloudinaryId, { resource_type: "raw" });
    const fileUrl = resource.secure_url;

    const response = await fetch(fileUrl);
    if (!response.ok) return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });

    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${product.filename || product.title + ".zip"}"`
    );
    headers.set("Content-Type", response.headers.get("content-type") || "application/octet-stream");

    return new NextResponse(response.body, { headers });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
