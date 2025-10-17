"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { register as registerAPI } from "@/api/auth";
import type { RegisterData } from "@/types";
import Loading from "@/components/common/Loading";
import styles from "./register.module.css";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone, FaLock, FaBriefcase, FaUserTie } from "react-icons/fa";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
      setShowPassword(!showPassword);
      setTimeout(() => passwordInputRef.current?.focus(), 0);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
      setTimeout(() => confirmPasswordInputRef.current?.focus(), 0);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        <div className={styles.card} style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
          <h1 className={styles.title}>Registration Successful!</h1>
          <p className={styles.subtitle}>
            Please check your email to verify your account.
            <br />
            Redirecting to login...
          </p>
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
          <div className={styles.nameFields}>
            <div className={styles.inputGroup}>
              <div className={styles.iconContainer}>
                <FaUser className={styles.inputIcon} />
              </div>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={form.first_name}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.nameInput}`}
              />
              <label htmlFor="first_name" className={styles.floatingLabel}>First Name</label>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.iconContainer}>
                <FaUser className={styles.inputIcon} />
              </div>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                value={form.last_name}
                onChange={handleChange}
                required
                className={`${styles.input} ${styles.nameInput}`}
              />
              <label htmlFor="last_name" className={styles.floatingLabel}>Last Name</label>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.iconContainer}>
              <FaEnvelope className={styles.inputIcon} />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
            <label htmlFor="email" className={styles.floatingLabel}>Email</label>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.iconContainer}>
              <FaPhone className={styles.inputIcon} />
            </div>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder=" "
              value={form.phone_number}
              onChange={handleChange}
              required
              className={styles.input}
              pattern="[0-9+\-\s()]*"
            />
            <label htmlFor="phone_number" className={styles.floatingLabel}>Phone Number</label>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordInputContainer}>
              <div className={styles.iconContainer}>
                <FaLock className={styles.inputIcon} />
              </div>
              <input
                id="password"
                ref={passwordInputRef}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder=" "
                value={form.password}
                onChange={handlePasswordChange}
                required
                minLength={8}
                className={`${styles.input} ${styles.passwordInput}`}
              />
              <label htmlFor="password" className={styles.floatingLabel}>Password</label>
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className={styles.passwordHint}>
              Must be at least 8 characters
            </div>
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.passwordInputContainer}>
              <div className={styles.iconContainer}>
                <FaLock className={styles.inputIcon} />
              </div>
              <input
                id="confirm_password"
                ref={confirmPasswordInputRef}
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className={`${styles.input} ${styles.passwordInput}`}
              />
              <label htmlFor="confirm_password" className={styles.floatingLabel}>Confirm Password</label>
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className={styles.passwordToggle}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className={styles.checkboxContainer}>
            <label className={styles.checkboxLabel}>
              <input
                id="is_employer"
                name="is_employer"
                type="checkbox"
                checked={form.is_employer}
                onChange={handleChange}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxCustom}>
                {form.is_employer ? <FaBriefcase className={styles.checkboxIcon} /> : <FaUserTie className={styles.checkboxIcon} />}
              </span>
              <span className={styles.checkboxText}>
                {form.is_employer ? 'I want to post jobs' : 'I\'m looking for jobs'}
              </span>
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
