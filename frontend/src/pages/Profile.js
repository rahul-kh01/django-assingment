import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const input = {
  width: "100%", padding: "0.5rem 0.8rem", borderRadius: 6,
  border: "1px solid #cbd5e1", fontSize: "0.95rem",
};

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    avatar: user?.avatar || "",
    role: user?.role || "user",
  });
  const [msg, setMsg] = useState("");

  const save = async (e) => {
    e.preventDefault();
    try {
      await API.patch("/auth/profile/", form);
      await refreshProfile();
      setMsg("Profile updated!");
    } catch {
      setMsg("Failed to update profile.");
    }
  };

  return (
    <div style={{ maxWidth: 450 }}>
      <h1>Profile</h1>
      <p style={{ color: "#64748b" }}>{user?.email}</p>
      {user?.avatar && <img src={user.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: "50%", marginTop: "1rem" }} />}
      <form onSubmit={save} style={{ marginTop: "1.5rem", display: "grid", gap: "0.8rem" }}>
        <input style={input} placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <input style={input} placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input style={input} placeholder="Avatar URL" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
        <select style={input} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="creator">Creator</option>
        </select>
        <button type="submit" style={{ padding: "0.6rem", borderRadius: 8, border: "none", background: "#7c3aed", color: "#fff", cursor: "pointer" }}>
          Save Changes
        </button>
        {msg && <p style={{ color: msg.includes("Failed") ? "red" : "green" }}>{msg}</p>}
      </form>
    </div>
  );
}