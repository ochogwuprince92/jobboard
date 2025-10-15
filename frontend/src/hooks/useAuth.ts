"use client";

import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        setUser(jwtDecode(storedToken));
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    setIsLoading(false);
  }, []);

  return { user, token, isLoading };
}
