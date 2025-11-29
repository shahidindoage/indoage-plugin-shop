"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProduct() {
  const [pluginData, setPluginData] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [thumbnailData, setThumbnailData] = useState(null);
const router = useRouter();
  const [uploadingPlugin, setUploadingPlugin] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set uploading states
    if (type === "plugin") setUploadingPlugin(true);
    else if (type === "logo") setUploadingLogo(true);
    else if (type === "thumbnail") setUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/upload?type=${type}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Store uploaded file info
      if (type === "plugin") setPluginData(data);
      else if (type === "logo") setLogoData(data);
      else if (type === "thumbnail") setThumbnailData(data);
    } catch (err) {
      alert(`Failed to upload ${type}: ${err.message}`);
    } finally {
      if (type === "plugin") setUploadingPlugin(false);
      else if (type === "logo") setUploadingLogo(false);
      else if (type === "thumbnail") setUploadingThumbnail(false);
      setUploadProgress(0);
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    if (!pluginData) {
      alert("Please upload the plugin file!");
      return;
    }

    const form = new FormData(e.target);

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          priceCents: Number(form.get("price")),
          cloudinaryId: pluginData.public_id,
          filename: pluginData.filename,
          logoId: logoData?.public_id,
          logoUrl: logoData?.url,
          thumbnailId: thumbnailData?.public_id,
          thumbnailUrl: thumbnailData?.url,
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      alert("✅ Product created successfully!");
      e.target.reset();
      router.push("/admin/products")
      setPluginData(null);
      setLogoData(null);
      setThumbnailData(null);
    } catch (err) {
      alert(`Error creating product: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Create New Product</h1>

      <form onSubmit={createProduct}>
        <input name="title" placeholder="Title" required />
        <br /><br />

        <textarea name="description" placeholder="Description" />
        <br /><br />

        <input type="number" name="price" placeholder="Price (cents)" required />
        <br /><br />

        {/* Plugin Upload */}
        <label>Plugin File (.zip)</label>
        <input type="file" onChange={(e) => uploadFile(e, "plugin")} required />
        {uploadingPlugin && <p>Uploading plugin... ⏳</p>}
        {pluginData && <p>Plugin uploaded ✔</p>}
        <br />

        {/* Logo Upload */}
        <label>Logo Image</label>
        <input type="file" onChange={(e) => uploadFile(e, "logo")} />
        {uploadingLogo && <p>Uploading logo... ⏳</p>}
        {logoData && <p>Logo uploaded ✔</p>}
        <br />

        {/* Thumbnail Upload */}
        <label>Thumbnail Image</label>
        <input type="file" onChange={(e) => uploadFile(e, "thumbnail")} />
        {uploadingThumbnail && <p>Uploading thumbnail... ⏳</p>}
        {thumbnailData && <p>Thumbnail uploaded ✔</p>}
        <br />

        <button
          type="submit"
          disabled={
            !pluginData ||
            uploadingPlugin ||
            uploadingLogo ||
            uploadingThumbnail
          }
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
