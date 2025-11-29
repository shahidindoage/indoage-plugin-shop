import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 10000,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const priceStr = formData.get("price")?.toString();
    const price = priceStr ? parseFloat(priceStr) : 0;
    const location = formData.get("location")?.toString(); // NEW
    const imageFile = formData.get("image");

    if (!name || !description || !price || !imageFile) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary (fixed)
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

    

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        location: location || null, // NEW
        image: uploadResult.secure_url,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Product Add Error:", err);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
};
