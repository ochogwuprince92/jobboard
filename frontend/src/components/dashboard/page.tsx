"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push("/login");
    } else if (user.role === "employer") {
      router.push("/dashboard/employer");
    } else {
      router.push("/dashboard/seeker");
    }
  }, [user, isLoading, router]);

  return <p>Loading dashboard...</p>;
}
