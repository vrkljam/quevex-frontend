import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { QuevexLogo } from "./QuevexLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/auth/login", { email, password });
      localStorage.setItem("Quevex_user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f5f7",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      {/* 1. Logo at the Top */}
      <div style={{ marginBottom: "40px" }}>
        <QuevexLogo size={140} />
      </div>

      {/* 2. Login Form Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "400px",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#172b4d",
            marginBottom: "8px",
            fontSize: "1.75rem",
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#5e6c84",
            fontSize: "0.9rem",
            marginBottom: "24px",
          }}
        >
          Log in to your Quevex workspace
        </p>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebe6",
              color: "#bf2600",
              padding: "10px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              marginBottom: "16px",
              border: "1px solid #ffbdad",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                color: "#5e6c84",
                fontSize: "0.85rem",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex@example.com"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #dfe1e6",
                boxSizing: "border-box",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                color: "#5e6c84",
                fontSize: "0.85rem",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #dfe1e6",
                boxSizing: "border-box",
                fontSize: "0.95rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: "#519839",
              color: "#ffffff",
              padding: "12px",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Verifying..." : "Log In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.85rem",
            color: "#5e6c84",
          }}
        >
          New to Quevex?{" "}
          <Link
            to="/register"
            style={{
              color: "#0079bf",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
