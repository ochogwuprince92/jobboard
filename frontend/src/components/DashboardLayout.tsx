"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaBriefcase,
  FaUsers,
  FaFileAlt,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaPlus,
  FaEye
} from "react-icons/fa";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "seeker" | "employer";
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const seekerNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/jobs", label: "Browse Jobs", icon: FaBriefcase },
    { href: "/applications", label: "My Applications", icon: FaFileAlt },
    { href: "/profile", label: "Profile", icon: FaCog },
    { href: "/notifications", label: "Notifications", icon: FaBell },
  ];

  const employerNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { href: "/jobs", label: "My Jobs", icon: FaBriefcase },
    { href: "/jobs/create", label: "Post Job", icon: FaPlus },
    { href: "/applications", label: "Applications", icon: FaUsers },
    { href: "/profile", label: "Profile", icon: FaCog },
    { href: "/notifications", label: "Notifications", icon: FaBell },
  ];

  const navItems = userType === "seeker" ? seekerNavItems : employerNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 px-4 bg-blue-600">
            <h1 className="text-xl font-bold text-white">JobBoard</h1>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {user?.first_name?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.is_employer ? "Employer" : "Job Seeker"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
