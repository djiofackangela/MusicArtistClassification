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
    <div className="auth-container">
      <h2>Verify OTP</h2>
      <p>We sent an OTP to your email: {email || "(unknown)"}</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </label>
        <button type="submit">Verify</button>
      </form>

      {message && <p className="info-message">{message}</p>}
    </div>
  );
}
