"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface ApplicationFormProps {
  jobId: number;
}

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { job: number; cover_letter: string }) =>
      api.post("/applications/", data),
    onSuccess: () => {
      alert("Application submitted successfully!");
      setCoverLetter("");
    },
    onError: (err: any) => {
      alert("Failed to submit application.");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ job: jobId, cover_letter: coverLetter });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <label>
        Cover Letter:
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          required
          rows={5}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </label>
      <button type="submit" disabled={mutation.isLoading} style={{ marginTop: "0.5rem" }}>
        {mutation.isLoading ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}
