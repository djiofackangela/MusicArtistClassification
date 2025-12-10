// frontend/src/pages/OtpVerifyPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function OtpVerifyPage() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const email = localStorage.getItem("pendingEmail") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Missing email. Please login again.");
      return;
    }

    if (!otp) {
      setMessage("OTP is required.");
      return;
    }

    try {
      const res = await api.post("/users/verify-login", {
        email,
        otp,
      });

      const { token, email: confirmedEmail, role } = res.data;

      // complete login
      login({ token, email: confirmedEmail, role });
      localStorage.removeItem("pendingEmail");

      setMessage("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "OTP verification failed.");
    }
  };

  return (
    <div className="page">
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>Verify OTP</h2>
          <p style={{ color: "#666", fontSize: "0.95rem", margin: "0" }}>Enter the code sent to your email</p>
        </div>

        <div
          style={{
            background: "#f0f7ff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #4db8ff",
          }}
        >
          <p style={{ margin: "0", fontSize: "0.9rem", color: "#1976d2", fontWeight: "500" }}
          >
            📧 {email || "(email not found)"}
          </p>
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
              htmlFor="otp"
              style={{
                display: "block",
                fontWeight: "600",
                color: "#4b3869",
                marginBottom: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              One-Time Password
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "1.2rem",
                letterSpacing: "0.5rem",
                textAlign: "center",
                fontWeight: "600",
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
            Verify & Sign In
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "8px",
              background: message.includes("successful") ? "#e8f5e9" : "#ffebee",
              color: message.includes("successful") ? "#2e7d32" : "#dc3545",
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
