"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface Application {
  id: number;
  job: number;
  cover_letter: string;
  created_at: string;
  status: string;
}

interface ApplicationFormProps {
  jobId: number;
}

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [coverLetter, setCoverLetter] = useState("");

  const mutation = useMutation<
    Application,
    AxiosError,
    { job: number; cover_letter: string }
  >({
    mutationFn: async (data) => {
      const response = await api.post<Application>("/applications/", data);
      return response.data;
    },
    onSuccess: () => {
      alert("Application submitted successfully!");
      setCoverLetter("");
    },
    onError: (err) => {
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
      <button type="submit" disabled={mutation.isPending} style={{ marginTop: "0.5rem" }}>
        {mutation.isPending ? "Submitting..." : "Apply"}
      </button>
    </form>
  );
}
