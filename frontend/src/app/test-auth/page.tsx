'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function TestAuth() {
  const { login, register, logout, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      alert("Login successful!");
    } catch (error: unknown) {
      alert(`Login failed: ${(error as Error).message}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({
        email,
        password,
        confirm_password: password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
      });
      alert("Registration successful! Please check your email to verify your account.");
      setIsLogin(true);
    } catch (error: unknown) {
      alert(`Registration failed: ${(error as Error).message}`);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear form
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
  };

  if (isAuthenticated) {
    return (
      <div style={styles.container}>
        <h1>Welcome, {user?.first_name}!</h1>
        <p>Email: {user?.email}</p>
        <p>Phone: {user?.phone_number}</p>
        <button onClick={logout} style={styles.button}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      
      {isLogin ? (
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" style={styles.button}>
            Login
          </button>
          <p style={styles.toggleText}>
            Don&apos;t have an account?{' '}
            <button 
              type="button" 
              onClick={toggleAuthMode}
              style={styles.toggleButton}
            >
              Register here
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your first name"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your last name"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Phone Number:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              style={styles.input}
              placeholder="Enter your phone number"
            />
          </div>
          <div style={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={styles.input}
              placeholder="Create a password (min 8 characters)"
            />
          </div>
          <button type="submit" style={styles.button}>
            Register
          </button>
          <p style={styles.toggleText}>
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={toggleAuthMode}
              style={styles.toggleButton}
            >
              Login here
            </button>
          </p>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem',
    ':hover': {
      backgroundColor: '#005bb5',
    },
  },
  toggleText: {
    marginTop: '1rem',
    textAlign: 'center' as const,
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#0070f3',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
    fontSize: '1rem',
  },
};
