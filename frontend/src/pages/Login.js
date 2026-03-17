import React from "react";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

const container = { maxWidth: 420, margin: "4rem auto", textAlign: "center" };
const btn = {
  display: "block", width: "100%", padding: "0.8rem", marginTop: "1rem",
  borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "1rem",
  cursor: "pointer", background: "#fff", fontWeight: 500,
};

export default function Login() {
  const googleLogin = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const githubLogin = () => {
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/github/callback`,
      scope: "read:user user:email",
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params}`;
  };

  return (
    <div style={container}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Welcome to Ahoum</h1>
      <p style={{ color: "#64748b" }}>Sign in to browse and book sessions</p>
      {GOOGLE_CLIENT_ID && (
        <button style={btn} onClick={googleLogin}>Continue with Google</button>
      )}
      {GITHUB_CLIENT_ID && (
        <button style={{ ...btn, background: "#24292f", color: "#fff" }} onClick={githubLogin}>
          Continue with GitHub
        </button>
      )}
    </div>
  );
}