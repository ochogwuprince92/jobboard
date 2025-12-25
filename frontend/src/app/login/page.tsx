"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { resendVerification } from "@/api/auth";
import SocialLoginButtons from "@/components/SocialLoginButtons";
import styles from "./page.module.css";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone, FaLock, FaArrowRight } from "react-icons/fa";

type LoginMethod = 'email' | 'phone';

interface LoginForm {
  email?: string;
  phone_number?: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleResendVerification = async () => {
    if (!form.email) return;
    
    setResendStatus("sending");
    setError("");
    
    try {
      await resendVerification(form.email);
      setResendStatus("sent");
    } catch (err) {
      setResendStatus("error");
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to resend verification email.");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    // Focus the password input after toggling visibility
    setTimeout(() => passwordInputRef.current?.focus(), 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Clear the other field when switching methods
      ...(name === 'email' ? { phone_number: '' } : name === 'phone_number' ? { email: '' } : {})
    }));
  };

  const handleMethodChange = (method: LoginMethod) => {
    setLoginMethod(method);
    setForm({ email: '', phone_number: '', password: '' });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResendStatus("idle");

    // Validation
    if ((!form.email && loginMethod === 'email') || 
        (!form.phone_number && loginMethod === 'phone') || 
        !form.password) {
      setError(`Please enter ${loginMethod === 'email' ? 'email' : 'phone number'} and password`);
      setLoading(false);
      return;
    }

    try {
      const identifier = loginMethod === 'email' ? form.email! : form.phone_number!;
      
      // Call the login function from useAuth which will handle the API call and state management
      await login({
        [loginMethod === 'email' ? 'email' : 'phone_number']: identifier,
        password: form.password
      });
      
      console.log("Login successful, redirecting to dashboard...");
      // Use router.push for client-side navigation
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Login error:", error);
      
      if ((error as { response?: { data?: { code?: string } } })?.response?.data?.code === "email_not_verified") {
        setError("Please verify your email before logging in.");
        setResendStatus("idle");
      } else {
        let errorMessage = "An error occurred during login. Please try again.";
      
      if ((error as { response?: { data?: { code?: string } } })?.response) {
        // Handle specific error responses from the server
        const { data } = (error as { response: { data: { detail?: string; error?: string; non_field_errors?: string | string[]; message?: string } } }).response;
        
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) 
            ? data.non_field_errors[0] 
            : data.non_field_errors;
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if ((error as { request?: unknown })?.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        errorMessage = (error as { message?: string })?.message || "An unknown error occurred";
      }
      
      console.error("Login error:", error);
      setError(errorMessage);
      }
    } finally {
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in with your email or phone</p>
        
        <div className={styles.inputMethodContainer}>
          <div className={styles.inputWithDropdown}>
            <div className={styles.inputGroup}>
              {/* Accessible label for the email/phone input (visually hidden but
                  present for tests and screen readers) */}
              <label htmlFor={loginMethod === 'email' ? 'email' : 'phone_number'} className="sr-only">{loginMethod === 'email' ? 'Email' : 'Phone'}</label>
              <div className={styles.inputPrefix}>
                {loginMethod === 'email' ? <FaEnvelope /> : <FaPhone />}
                <select
                  value={loginMethod}
                  onChange={(e) => handleMethodChange(e.target.value as LoginMethod)}
                  className={styles.methodSelect}
                  aria-label="Select login method"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>
              <input
                id={loginMethod}
                name={loginMethod === 'email' ? 'email' : 'phone_number'}
                type={loginMethod === 'email' ? 'email' : 'tel'}
                value={loginMethod === 'email' ? form.email || '' : form.phone_number || ''}
                onChange={handleChange}
                className={`${styles.input} ${styles.methodInput}`}
                placeholder={`Enter your ${loginMethod === 'email' ? 'email address' : 'phone number'}`}
                pattern={loginMethod === 'phone' ? "[0-9+\-\s()]*" : undefined}
                required
              />
            </div>
          </div>
        </div>

        {error && !error.includes("verify your email") && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.passwordInputContainer}>
              <div className={styles.iconContainer}>
                <FaLock className={styles.inputIcon} />
              </div>
              <input
                id="password"
                ref={passwordInputRef}
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                className={`${styles.input} ${styles.passwordInput}`}
                placeholder="Enter your password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Log In</span>
                <FaArrowRight className={styles.buttonIcon} />
              </>
            )}
          </button>

          <div className={styles.authLinksContainer}>
              <div className={styles.authLinks}>
                <a href="/forgot-password" className={styles.authLink}>
                  Forgot password?
                </a>
              </div>
              {error.includes("verify your email") && (
                <div className={styles.verifyEmailContainer}>
                <p className={styles.verifyEmailText}>Please verify your email to continue.</p>
                <button 
                  type="button"
                  onClick={handleResendVerification} 
                  disabled={resendStatus === "sending"}
                  className={`${styles.button} ${styles.verifyButton}`}
                >
                  {resendStatus === "sending" ? "Sending..." : "Resend Verification Email"}
                </button>
                {resendStatus === "sent" && (
                  <p className={styles.success}>Verification email sent! Please check your inbox.</p>
                )}
              </div>
              )}
          </div>
        </form>

        <SocialLoginButtons />

        <p className={styles.footer}>
          Don&apos;t have an account?{' '}
          <a href="/register" className={styles.link}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
