"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register as registerAPI } from "@/api/auth";
import type { RegisterData } from "@/types";
import Loading from "@/components/common/Loading";
import styles from "../login/page.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterData>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    is_employer: false,
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (form.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      await registerAPI(form);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.entries(errorData.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        setError(errorMessages);
      } else {
        setError(errorData?.detail || errorData?.error || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Creating your account..." />;

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
            <h1 className={styles.title}>Registration Successful!</h1>
            <p className={styles.subtitle}>
              Please check your email to verify your account.
              Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join our job board platform</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className={styles.inputGroup}>
              <label htmlFor="first_name">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={form.first_name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="last_name">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone_number">Phone Number</label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="+1234567890"
              value={form.phone_number}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className={styles.input}
            />
            <small style={{ color: "#666", fontSize: "0.85rem" }}>
              Minimum 8 characters
            </small>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={styles.input}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              id="is_employer"
              name="is_employer"
              type="checkbox"
              checked={form.is_employer}
              onChange={handleChange}
              style={{ width: "auto" }}
            />
            <label htmlFor="is_employer" style={{ margin: 0, fontWeight: "normal" }}>
              I'm an employer looking to post jobs
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/login" className={styles.link}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
