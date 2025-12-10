// frontend/src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      await api.post("/users/login", {
        email: form.email,
        password: form.password,
      });

      // store email temporarily for OTP step
      localStorage.setItem("pendingEmail", form.email);
      setMessage("OTP sent to your email. Please check console (simulated).");
      navigate("/verify-otp");
    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.message || "Login failed. Please check credentials."
      );
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Welcome Back</h2>
          <p style={{ color: "#666", fontSize: "0.95rem", margin: "0" }}>Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "18px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
          }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                transition: "border 0.3s ease, box-shadow 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#845ec2";
                e.target.style.boxShadow = "0 0 5px rgba(132, 94, 194, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1rem",
                transition: "border 0.3s ease, box-shadow 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#845ec2";
                e.target.style.boxShadow = "0 0 5px rgba(132, 94, 194, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ddd";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#845ec2",
              color: "white",
              border: "none",
              padding: "0.85rem",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s ease, transform 0.1s ease",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#5c4b99";
              e.target.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#845ec2";
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign In
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              background: message.includes("OTP") ? "#e3f2fd" : "#ffebee",
              color: message.includes("OTP") ? "#1976d2" : "#dc3545",
              fontSize: "0.9rem",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
