import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { QuevexLogo } from "./QuevexLogo";
// 1. Import the eye icons from lucide-react
import { Eye, EyeOff } from "lucide-react";
import "../App.css"; // Import the external CSS sheet here

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // 2. State to track password visibility
  const [showPassword, setShowPassword] = useState(false);
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

  // 3. Toggle helper function
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-container">
      {/* 1. Logo at the Top */}
      <div className="auth-logo-wrapper">
        <QuevexLogo size={140} />
      </div>

      {/* 2. Login Form Card */}
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to your Quevex workspace</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="alex@example.com"
              className="auth-input"
            />
          </div>

          <div className="auth-form-group password-group">
            <label className="auth-label">Password</label>
            {/* 4. Relative wrapper container houses both input and eye icon button */}
            <div style={{ position: "relative" }}>
              <input
                // 5. Dynamic type field switches between text and password
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="auth-input password-input"
              />
              {/* 7. Icon Button positioned neatly overlaying the right side of the input */}
              <button
                type="button" // 8. Keeps the button from triggering a premature form submit
                onClick={togglePasswordVisibility}
                className="auth-input password-input"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn login-btn"
          >
            {loading ? "Verifying..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer-text">
          New to Quevex?{" "}
          <Link to="/register" className="auth-link">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
