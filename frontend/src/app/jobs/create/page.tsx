"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/api/jobs";
import Loading from "@/components/common/Loading";

export default function CreateJobPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    min_salary: "",
    max_salary: "",
    employment_type: "full-time" as "full-time" | "part-time" | "contract" | "internship",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name === 'employment_type' 
        ? value as "full-time" | "part-time" | "contract" | "internship"
        : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createJob({
        ...form,
        min_salary: form.min_salary ? parseInt(form.min_salary) : undefined,
        max_salary: form.max_salary ? parseInt(form.max_salary) : undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError((err as { response?: { data?: { detail?: string; error?: string } } })?.response?.data?.detail || (err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loading fullScreen message="Loading..." />;
  
  if (!isAuthenticated || !user?.is_employer) {
    router.push("/login");
    return null;
  }

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
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
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
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          Requirements
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={3}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            placeholder="Required skills and qualifications"
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
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          Employment Type
          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <label>
            Min Salary
            <input
              type="number"
              name="min_salary"
              value={form.min_salary}
              onChange={handleChange}
              placeholder="50000"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>

          <label>
            Max Salary
            <input
              type="number"
              name="max_salary"
              value={form.max_salary}
              onChange={handleChange}
              placeholder="100000"
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            />
          </label>
        </div>

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
