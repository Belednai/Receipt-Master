import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon } from "lucide-react";

// Import modular settings components
import ProfileSettings from "@/components/settings/ProfileSettings";
import UserManagementSettings from "@/components/settings/UserManagementSettings";
import ReceiptSettings from "@/components/settings/ReceiptSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ReportsExportSettings from "@/components/settings/ReportsExportSettings";
import AuditLogsSettings from "@/components/settings/AuditLogsSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SessionActivitySettings from "@/components/settings/SessionActivitySettings";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const isAdmin = user?.role === 'admin';

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Responsive Tab Layout */}
          <div className="space-y-2">
            {/* Large Screen Layout - Single Row */}
            <div className="hidden lg:block">
              <TabsList className="flex w-full gap-2 p-2 bg-muted/50">
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Profile
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger 
                    value="users" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Users
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="receipt" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Receipt
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="security" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Security
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="reports" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Reports
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="audit" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Audit
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="notifications" 
                    className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Notifications
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="sessions" 
                  className="flex-1 min-w-[100px] text-sm font-medium px-4 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Sessions
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Small/Medium Screen Layout - Two Rows */}
            <div className="lg:hidden space-y-2">
              {/* Top Row - Main tabs */}
              <TabsList className="flex w-full flex-wrap gap-2 p-2 bg-muted/50">
                <TabsTrigger 
                  value="profile" 
                  className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Profile
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger 
                    value="users" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Users
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="receipt" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Receipt
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="security" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Security
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Bottom Row - Secondary tabs (Reports, Audit, Notifications, Sessions) */}
              <TabsList className="flex w-full flex-wrap gap-2 p-2 bg-muted/30">
                {isAdmin && (
                  <TabsTrigger 
                    value="reports" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Reports
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="audit" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Audit
                  </TabsTrigger>
                )}
                {isAdmin && (
                  <TabsTrigger 
                    value="notifications" 
                    className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Notifications
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="sessions" 
                  className="flex-1 min-w-[80px] text-xs sm:text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-background/80 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Sessions
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Profile Settings - All Users */}
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          {/* User Management - Admin Only */}
          {isAdmin && (
            <TabsContent value="users">
              <UserManagementSettings />
            </TabsContent>
          )}

          {/* Receipt Settings - Admin Only */}
          {isAdmin && (
            <TabsContent value="receipt">
              <ReceiptSettings />
            </TabsContent>
          )}

          {/* Security Settings - Admin Only */}
          {isAdmin && (
            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          )}

          {/* Reports & Export - Admin Only */}
          {isAdmin && (
            <TabsContent value="reports">
              <ReportsExportSettings />
            </TabsContent>
          )}

          {/* Audit Logs - Admin Only */}
          {isAdmin && (
            <TabsContent value="audit">
              <AuditLogsSettings />
            </TabsContent>
          )}

          {/* Notification Settings - Admin Only */}
          {isAdmin && (
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
          )}

          {/* Session Activity - All Users */}
          <TabsContent value="sessions">
            <SessionActivitySettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings; 