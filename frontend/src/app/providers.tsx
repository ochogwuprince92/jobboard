// src/app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Navigation from "@/components/layout/Navigation";
import ErrorBoundary from "@/components/common/ErrorBoundary";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Navigation />
          <main style={{ minHeight: 'calc(100vh - 70px)' }}>
            {children}
          </main>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}
