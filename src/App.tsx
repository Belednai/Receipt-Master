import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SidebarLayout } from "@/components/SidebarLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginLayout from "@/components/LoginLayout";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import CashierDashboard from "./pages/CashierDashboard";
import UserManagement from "./pages/UserManagement";
import CreateReceipt from "./pages/CreateReceipt";
import Receipts from "./pages/Receipts";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CreateUser from "./pages/CreateUser";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import DashboardRouter from "./components/DashboardRouter";
import ProductManagement from "./pages/ProductManagement";
import CompanySettings from "./pages/CompanySettings";
import CashierReceipt from "./pages/CashierReceipt";
import Support from "./pages/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <LoginLayout>
                  <Login />
                </LoginLayout>
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <DashboardRouter />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SidebarLayout>
                    <AdminDashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SidebarLayout>
                    <UserManagement />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard/users/create" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SidebarLayout>
                    <CreateUser />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/cashier-dashboard" element={
                <ProtectedRoute allowedRoles={['cashier']}>
                  <SidebarLayout>
                    <CashierDashboard />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <CreateReceipt />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/cashier-receipt" element={
                <ProtectedRoute allowedRoles={['cashier']}>
                  <SidebarLayout>
                    <CashierReceipt />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/receipts" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Receipts />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Notifications />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Profile />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SidebarLayout>
                    <Settings />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard/products" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SidebarLayout>
                    <ProductManagement />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard/company-settings" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SidebarLayout>
                    <CompanySettings />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <SidebarLayout>
                    <Support />
                  </SidebarLayout>
                </ProtectedRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
