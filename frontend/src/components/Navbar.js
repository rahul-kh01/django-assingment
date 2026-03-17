import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const styles = {
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "1rem 2rem", background: "#1a1a2e", color: "#fff",
  },
  logo: { fontSize: "1.4rem", fontWeight: 700, color: "#a78bfa", textDecoration: "none" },
  links: { display: "flex", gap: "1.2rem", alignItems: "center" },
  link: { color: "#e0e0e0", textDecoration: "none", fontSize: "0.95rem" },
  btn: {
    padding: "0.45rem 1rem", borderRadius: 6, border: "none",
    background: "#7c3aed", color: "#fff", cursor: "pointer", fontSize: "0.9rem",
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Ahoum</Link>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Catalog</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            {user.role === "creator" && <Link to="/creator" style={styles.link}>Creator</Link>}
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button style={styles.btn} onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </>
        ) : (
          <Link to="/login"><button style={styles.btn}>Sign In</button></Link>
        )}
      </div>
    </nav>
  );
}