import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "plugin"; // plugin, logo, thumbnail

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let folder = "plugins";
    let resourceType = "raw";
    let originalName = file.name;

    if (type === "logo" || type === "thumbnail") {
      folder = `plugins/${type}`;
      resourceType = "image";

      // Ensure valid image extension
      if (!originalName.match(/\.(png|jpg|jpeg|webp|gif)$/i)) {
        originalName += ".png";
      }
    } else {
      // plugin ZIP
      if (!originalName.toLowerCase().endsWith(".zip")) originalName += ".zip";

      // Add timestamp to public_id to avoid collisions
      const timestamp = Date.now();
      originalName = `${originalName.replace(/\.[^/.]+$/, "")}_${timestamp}.zip`;
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          public_id: originalName.replace(/\.[^/.]+$/, ""),
          overwrite: true, // overwrite if same public_id exists
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
      type,
    });
  } catch (error) {
    console.error("❌ Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
