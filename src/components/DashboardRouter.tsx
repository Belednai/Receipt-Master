import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/pages/AdminDashboard";
import CashierDashboard from "@/pages/CashierDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'cashier') {
    return <CashierDashboard />;
  }

  // Default to admin dashboard for admin users or unknown roles
  return <AdminDashboard />;
};

export default DashboardRouter; 