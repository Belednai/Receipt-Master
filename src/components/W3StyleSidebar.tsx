import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Receipt,
  Settings,
  Users,
  UserPlus,
  BarChart3,
  DollarSign,
  Clock,
  User,
  Bell,
  Package,
  Building2,
  Plus,
  Headphones
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: MenuItem[];
}

const getMenuGroups = (userRole?: string): MenuGroup[] => {
  const groups: MenuGroup[] = [];

  // Receipt Management group
  const receiptManagementItems = [
    { name: "View Receipts", href: "/receipts", icon: Receipt },
  ];

  // Add cashier-specific items to Receipt Management
  if (userRole === 'cashier') {
    receiptManagementItems.push(
      { name: "Create Receipt", href: "/cashier-receipt", icon: Plus }
    );
  }

  // Add admin-specific items to Receipt Management
  if (userRole === 'admin') {
    receiptManagementItems.push(
      { name: "Items", href: "/admin-dashboard/products", icon: Package },
      { name: "Company Details", href: "/admin-dashboard/company-settings", icon: Building2 }
    );
  }

  groups.push({
    title: "Receipt Management",
    icon: FileText,
    items: receiptManagementItems
  });

  // User Management group (admin only)
  if (userRole === 'admin') {
    groups.push({
      title: "User Management",
      icon: Users,
      items: [
        { name: "All Users", href: "/admin-dashboard/users", icon: Users },
        { name: "Add User", href: "/admin-dashboard/users/create", icon: UserPlus },
      ]
    });

    // Analytics group (admin only)
    groups.push({
      title: "Analytics",
      icon: BarChart3,
      items: [
        { name: "Revenue Reports", href: "/analytics", icon: DollarSign },
        { name: "User Activity", href: "/analytics", icon: Clock },
        { name: "System Health", href: "/analytics", icon: BarChart3 },
      ]
    });
  }

  return groups;
};

const getIndividualItems = (userRole?: string): MenuItem[] => {
  const items: MenuItem[] = [];

  // Settings as individual item
  items.push({ name: "Settings", href: "/settings", icon: Settings });

  return items;
};

export const W3StyleSidebar = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  
  const menuGroups = getMenuGroups(user?.role);
  const individualItems = getIndividualItems(user?.role);

  const toggleGroup = (groupTitle: string) => {
    const newOpenGroups = new Set(openGroups);
    if (newOpenGroups.has(groupTitle)) {
      newOpenGroups.delete(groupTitle);
    } else {
      newOpenGroups.add(groupTitle);
    }
    setOpenGroups(newOpenGroups);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Dashboard Item */}
        <div className="p-3 pt-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-base font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200",
                isActive && "bg-blue-50 text-blue-700 font-medium"
              )
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            Dashboard
          </NavLink>
        </div>

        {/* Notification Item */}
        <div className="p-3">
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 relative",
                isActive && "bg-blue-50 text-blue-700 font-medium"
              )
            }
          >
            <Bell className="w-4 h-4 mr-3" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* Menu Groups */}
        <div className="px-3 pb-4">
          {menuGroups.map((group) => (
            <Collapsible
              key={group.title}
              open={openGroups.has(group.title)}
              onOpenChange={() => toggleGroup(group.title)}
            >
              <CollapsibleTrigger asChild>
                <button className="w-full flex items-center justify-between p-2.5 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 group mb-1">
                  <div className="flex items-center">
                    <group.icon className="w-4 h-4 mr-3 text-gray-600 group-hover:text-gray-800" />
                    <span className="font-medium text-sm">{group.title}</span>
                  </div>
                  {openGroups.has(group.title) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="ml-6 space-y-0.5 mb-2">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200",
                          isActive && "bg-blue-50 text-blue-700 font-medium"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Individual Items */}
        <div className="px-3 pb-4">
          {individualItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200",
                  isActive && "bg-blue-50 text-blue-700 font-medium"
                )
              }
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 