import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallback() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) { setError("No authorization code received."); return; }

    API.post(`/auth/${provider}/`, {
      code,
      redirect_uri: `${window.location.origin}/auth/${provider}/callback`,
    })
      .then(({ data }) => {
        login(data.user, data.tokens);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => setError("Authentication failed. Please try again."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <p style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>{error}</p>;
  return <p style={{ textAlign: "center", marginTop: "3rem" }}>Signing you in...</p>;
}