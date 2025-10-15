"use client";

import AuthForm from "@/components/AuthForm";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const res = await fetch("/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Login failed");

      const result = await res.json();
      localStorage.setItem("access_token", result.access);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed. Check credentials.");
    }
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
