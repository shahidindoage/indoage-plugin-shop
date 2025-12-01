import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const timestamp = Date.now();
    const originalName = `${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}.zip`;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "plugins",
          public_id: originalName.replace(/\.[^/.]+$/, ""),
          overwrite: true,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      public_id: uploadResult.public_id,
      filename: originalName,
      url: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Plugin upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
