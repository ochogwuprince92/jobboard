"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { useAuth } from "@/hooks/useAuth";

export default function CreateJobPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/jobs/`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push("/dashboard/employer");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Post a New Job</h1>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <label>
          Job Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Location
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          Salary
          <input
            type="text"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="e.g. ₦150,000/month"
            style={{ width: "100%", padding: "8px" }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#ccc" : "#0070f3",
            color: "white",
            padding: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
}
