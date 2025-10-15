"use client";

import { useState } from "react";

interface ApplyButtonProps {
  jobId: string;
}

export default function ApplyButton({ jobId }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/applications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job: jobId }),
      });
      if (!res.ok) throw new Error("Failed to apply");
      setApplied(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button disabled={loading || applied} onClick={handleApply}>
      {applied ? "Applied" : loading ? "Applying..." : "Apply"}
    </button>
  );
}
