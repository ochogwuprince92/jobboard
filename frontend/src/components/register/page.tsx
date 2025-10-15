"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: { email: string; password: string; name?: string }) => {
    try {
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Registration failed");

      alert("Registration successful! Verify your email.");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Try again.");
    }
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
}
