"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProduct({ params }) {
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState(null);
  const [pluginData, setPluginData] = useState(null);
  const [logoData, setLogoData] = useState(null);
  const [thumbnailData, setThumbnailData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load product
  useEffect(() => {
    const loadProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  // File Upload Handler
  const uploadFile = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload route
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
    }
  };

  // Update Product Handler
  const updateProduct = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      priceCents: Number(form.get("price")),
      cloudinaryId: pluginData?.public_id || product.cloudinaryId,
      filename: pluginData?.filename || product.filename,
      logoId: logoData?.public_id || product.logoId,
      logoUrl: logoData?.url || product.logoUrl,
      thumbnailId: thumbnailData?.public_id || product.thumbnailId,
      thumbnailUrl: thumbnailData?.url || product.thumbnailUrl,
    };

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to update product");
      return;
    }

    alert("✅ Product updated successfully!");
    router.push("/admin/products");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>Edit Product</h1>

      <form onSubmit={updateProduct}>
        <input
          name="title"
          defaultValue={product.title}
          placeholder="Title"
          required
        />
        <br /><br />

        <textarea
          name="description"
          defaultValue={product.description}
          placeholder="Description"
        />
        <br /><br />

        <input
          type="number"
          name="price"
          defaultValue={product.priceCents}
          placeholder="Price (cents)"
          required
        />
        <br /><br />

        {/* Plugin Upload */}
        <label>Plugin File (.zip)</label>
        <input type="file" onChange={(e) => uploadFile(e, "plugin")} />
        <p>
          {pluginData
            ? `New plugin uploaded ✔ (${pluginData.filename})`
            : `Current: ${product.filename}`}
        </p>
        <br />

        {/* Logo Upload */}
        <label>Logo</label>
        <input type="file" onChange={(e) => uploadFile(e, "logo")} />
        <div>
          {logoData ? (
            <img src={logoData.url} width={60} />
          ) : (
            product.logoUrl && <img src={product.logoUrl} width={60} />
          )}
        </div>
        <br />

        {/* Thumbnail Upload */}
        <label>Thumbnail</label>
        <input type="file" onChange={(e) => uploadFile(e, "thumbnail")} />
        <div>
          {thumbnailData ? (
            <img src={thumbnailData.url} width={100} />
          ) : (
            product.thumbnailUrl && <img src={product.thumbnailUrl} width={100} />
          )}
        </div>
        <br />

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}
