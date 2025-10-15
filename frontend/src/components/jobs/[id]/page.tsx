"use client";

import { useParams } from "next/navigation";
import { useJobDetail, useApplyForJob } from "@/hooks/useJobs"; // custom hooks
import { useState } from "react";

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: job, isLoading } = useJobDetail(id as string);
  const applyMutation = useApplyForJob();

  const [form, setForm] = useState({
    cover_letter: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await applyMutation.mutateAsync({ job_id: id, ...form });
      alert("Application submitted successfully!");
    } catch (err) {
      alert("Failed to apply. Please try again.");
    }
  };

  if (isLoading) return <p>Loading job...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-4">{job.company_name}</p>
      <p className="text-gray-600 mb-6">{job.description}</p>

      <form onSubmit={handleSubmit} className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-2">Apply for this Job</h2>
        <textarea
          name="cover_letter"
          placeholder="Write your cover letter..."
          value={form.cover_letter}
          onChange={(e) => setForm({ cover_letter: e.target.value })}
          className="w-full border rounded-lg p-2"
          rows={5}
          required
        />
        <button
          type="submit"
          disabled={applyMutation.isPending}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {applyMutation.isPending ? "Submitting..." : "Apply"}
        </button>
      </form>
    </div>
  );
}
