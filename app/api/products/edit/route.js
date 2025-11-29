import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 10000,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const priceStr = formData.get("price")?.toString();
    const price = priceStr ? parseFloat(priceStr) : 0;
    const location = formData.get("location")?.toString();
    const imageFile = formData.get("image");

    if (!id || !name || !description || !price) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        location: location || null,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (err) {
    console.error("Product Edit Error:", err);
    return NextResponse.json({ error: "Failed to edit product" }, { status: 500 });
  }
};
