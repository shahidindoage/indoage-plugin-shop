"use client";

import { useEffect, useState } from "react";

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({}); // track loading per license

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const res = await fetch("/api/admin/licenses");
      const data = await res.json();
      setLicenses(data);
    } catch (err) {
      console.error("Failed to fetch licenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this license?")) return;

    try {
      const res = await fetch(`/api/admin/licenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLicenses(licenses.filter((l) => l.id !== id));
        alert("License deleted successfully!");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete license");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting license");
    }
  };

  const handleStatusChange = async (id, value) => {
    setUpdating((prev) => ({ ...prev, [id]: true })); // start loading
    try {
      const res = await fetch(`/api/admin/licenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: value === "true" }),
      });

      if (res.ok) {
        const updated = await res.json();
        setLicenses((prev) =>
          prev.map((l) => (l.id === id ? { ...l, isActive: updated.isActive } : l))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false })); // stop loading
    }
  };

  if (loading) return <p>Loading licenses...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Licenses</h1>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>License Key</th>
            <th>User</th>
            <th>Email</th>
            <th>Product</th>
            <th>Active</th>
            <th>Domain</th>
            <th>Created At</th>
            <th>Expires At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {licenses.map((license) => (
            <tr key={license.id} style={{ textAlign: "center" }}>
              <td>{license.key}</td>
              <td>{license.user?.name}</td>
              <td>{license.user?.email}</td>
              <td>{license.product?.title}</td>
              <td>
                {updating[license.id] ? (
                  <span>Updating...</span>
                ) : (
                  <select
                    value={license.isActive}
                    onChange={(e) => handleStatusChange(license.id, e.target.value)}
                    style={styles.select}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                )}
              </td>
              <td>{license.domain || "-"}</td>
              <td>{new Date(license.createdAt).toLocaleString()}</td>
              <td>{license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : "-"}</td>
              <td>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(license.id)}
                  disabled={updating[license.id]}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: { width: "100%", borderCollapse: "collapse" },
  deleteBtn: {
    padding: "5px 10px",
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    backgroundColor: "#e74c3c",
    color: "#fff",
  },
  select: {
    padding: "5px",
    borderRadius: 5,
    border: "1px solid #ccc",
  },
};
