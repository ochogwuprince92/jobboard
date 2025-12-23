"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loading from "@/components/common/Loading";
import EmployerDashboard from "@/components/dashboard/employer/page";
import SeekerDashboard from "@/components/dashboard/seeker/page";
import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) return <Loading fullScreen message="Loading dashboard..." />;

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <DashboardLayout userType={user?.is_employer ? "employer" : "seeker"}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.first_name}!
                </h1>
                <p className="text-gray-600 mt-1">
                  {user?.is_employer ? "Manage your job postings and applications" : "Find your dream job and track your applications"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="font-semibold text-gray-900">
                  {user?.is_employer ? "Employer" : "Job Seeker"}
                </p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          {user?.is_employer ? <EmployerDashboard /> : <SeekerDashboard />}
        </div>
      </div>
    </DashboardLayout>
  );
}
