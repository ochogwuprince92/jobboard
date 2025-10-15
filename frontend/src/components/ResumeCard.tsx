"use client";

interface ResumeCardProps {
  name: string;
  fileUrl: string;
  uploadedAt: string;
}

export default function ResumeCard({ name, fileUrl, uploadedAt }: ResumeCardProps) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", borderRadius: "8px", marginBottom: "8px" }}>
      <h4>{name}</h4>
      <p>Uploaded: {new Date(uploadedAt).toLocaleDateString()}</p>
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
    </div>
  );
}
