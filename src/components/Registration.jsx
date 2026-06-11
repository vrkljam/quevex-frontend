import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { QuevexLogo } from "./QuevexLogo";
// 1. Import the eye icons from lucide-react
import { Eye, EyeOff } from "lucide-react";
import "../App.css"; // Import the external CSS sheet here

const Register = () => {
  const [username, setUsername] = useState("");
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
      const response = await API.post("/auth/register", {
        username,
        email,
        password,
      });

      // Auto-login by saving registration payload directly to state tracking storage
      localStorage.setItem("Quevex_user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Server unreachable.",
      );
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
      <div className="auth-logo-wrapper">
        <QuevexLogo size={140} />
      </div>
      <div className="auth-card">
        <h2 className="auth-title">Quevex</h2>
        <p className="auth-subtitle">Create your account</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="e.g. dev_alex"
              className="auth-input"
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label className="auth-form-group">Email Address</label>
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
            <label className="auth-lable">Password (Min 6 chars)</label>
            {/* 4. Relative wrapper container houses both input and eye icon button */}
            <div className="auth-input-wrapper">
              <input
                // 5. Dynamic type field switches between text and password
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="auth-input password-input"
              />
              {/* 7. Icon Button positioned neatly overlaying the right side of the input */}
              <button
                type="button" // 8. Keeps the button from triggering a premature form submit
                onClick={togglePasswordVisibility}
                className="auth-eye-button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn register-btn"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
