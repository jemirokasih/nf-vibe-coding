"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type Mode = "view" | "edit";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [mode, setMode] = useState<Mode>("view");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setUser(data);
        setForm({ name: data.name, email: data.email });
      })
      .catch(() => setError("Failed to load user."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      setUser(data);
      setMode("view");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete user "${user?.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDeleting(false);
    }
  };

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return <div className="loading"><div className="spinner" /> Loading...</div>;
  }

  if (!user) {
    return (
      <>
        <Link href="/" className="back-link">← Back to Users</Link>
        <div className="alert alert--error">{error || "User not found."}</div>
      </>
    );
  }

  return (
    <>
      <Link href="/" className="back-link">← Back to Users</Link>

      <div className="detail-header">
        <div className="avatar">{initials(user.name)}</div>
        <div className="detail-header__info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
        <div className="detail-actions">
          {mode === "view" && (
            <>
              <button className="btn btn--secondary" onClick={() => setMode("edit")}>Edit</button>
              <button className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {mode === "view" ? (
        <div className="card">
          <div className="meta-list">
            <div className="meta-item">
              <span className="meta-item__label">ID</span>
              <span className="meta-item__value">#{user.id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Name</span>
              <span className="meta-item__value">{user.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Email</span>
              <span className="meta-item__value">{user.email}</span>
            </div>
            <div className="meta-item">
              <span className="meta-item__label">Created At</span>
              <span className="meta-item__value">
                {new Date(user.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSave} className="form">
            <div className="form-group">
              <label htmlFor="edit-name" className="form-label">Name</label>
              <input
                id="edit-name"
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-email" className="form-label">Email</label>
              <input
                id="edit-email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => { setMode("view"); setError(""); setForm({ name: user.name, email: user.email }); }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
