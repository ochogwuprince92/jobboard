"use client";

import { useEffect, useState } from "react";
import ResumeCard from "@/components/ResumeCard";

interface Resume {
  id: string;
  name: string;
  file: string;
  uploaded_at: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await fetch("/api/resumes/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch resumes");
        const data = await res.json();
        setResumes(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div>
      <h2>Your Resumes</h2>
      {resumes.length ? (
        resumes.map((r) => (
          <ResumeCard key={r.id} name={r.name} fileUrl={r.file} uploadedAt={r.uploaded_at} />
        ))
      ) : (
        <p>No resumes uploaded yet.</p>
      )}
    </div>
  );
}
