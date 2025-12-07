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
    <div className="auth-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Login</button>
      </form>

      {message && <p className="info-message">{message}</p>}
    </div>
  );
}
