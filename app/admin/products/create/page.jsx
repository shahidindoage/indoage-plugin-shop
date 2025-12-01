"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function NewProduct() {
  const router = useRouter();

  const [pluginData, setPluginData] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [thumbnailData, setThumbnailData] = useState(null);

  const [uploadingPlugin, setUploadingPlugin] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const [description, setDescription] = useState(""); // Markdown input

  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "plugin") setUploadingPlugin(true);
    else if (type === "logo") setUploadingLogo(true);
    else if (type === "thumbnail") setUploadingThumbnail(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const route =
        type === "plugin"
          ? "/api/upload-plugin"
          : type === "logo"
          ? "/api/upload-logo"
          : "/api/upload-thumbnail";

      const res = await fetch(route, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      if (type === "plugin") setPluginData(data);
      else if (type === "logo") setLogoData(data);
      else if (type === "thumbnail") setThumbnailData(data);
    } catch (err) {
      alert(`Failed to upload ${type}: ${err.message}`);
    } finally {
      if (type === "plugin") setUploadingPlugin(false);
      else if (type === "logo") setUploadingLogo(false);
      else if (type === "thumbnail") setUploadingThumbnail(false);
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
      const res = await fetch("/api/admin/products/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description, // send markdown
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
      setPluginData(null);
      setLogoData(null);
      setThumbnailData(null);
      setDescription("");
      router.push("/admin/products");
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

        {/* Markdown Description */}
        <label>Description (Markdown supported)</label>
        <textarea
          name="description"
          placeholder="Write your description in Markdown"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <div style={{ border: "1px solid #ccc", padding: 10, marginBottom: 20 }}>
          <strong>Preview:</strong>
          <ReactMarkdown>{description}</ReactMarkdown>
        </div>

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
          disabled={uploadingPlugin || uploadingLogo || uploadingThumbnail}
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
