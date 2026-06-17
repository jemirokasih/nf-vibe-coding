"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setError("Failed to load users.");
      })
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage all users in the system.</p>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">👤</div>
          <h2>No users yet</h2>
          <p>Create your first user to get started.</p>
          <Link href="/users/new" className="btn btn--primary">+ New User</Link>
        </div>
      ) : (
        <div className="user-list">
          {users.map((user) => (
            <Link key={user.id} href={`/users/${user.id}`} className="user-card">
              <div className="avatar">{initials(user.name)}</div>
              <div className="user-card__info">
                <div className="user-card__name">{user.name}</div>
                <div className="user-card__email">{user.email}</div>
              </div>
              <div className="user-card__date">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
