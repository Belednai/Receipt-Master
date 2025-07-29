import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Settings,
  LogOut,
  User,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import belednaiLogo from "@/assets/belednai-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { getCompanySettings } from "@/lib/product-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const getNavItems = (userRole?: string) => {
  // Return empty array since we're removing navigation items from top navbar
  return [];
};

export const Navigation = () => {
  const [companyInfo, setCompanyInfo] = useState<{ name: string; phone: string } | null>(null);
  const { user, logout } = useAuth();

  // Load company information
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const settings = await getCompanySettings();
        if (settings) {
          setCompanyInfo({
            name: settings.name,
            phone: settings.phone
          });
        }
      } catch (error) {
        console.error('Failed to load company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);

  return (
    <nav className="bg-card border-b border-border shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Section: Logo */}
          <div className="flex items-center">
            {/* Logo and Software Name */}
            <div className="flex-shrink-0 flex items-center">
              <img 
                src={belednaiLogo} 
                alt="Receipt Master" 
                className="h-8 w-8 mr-3"
              />
              <div>
                <span className="text-xl font-semibold text-foreground block">
                  Receipt Master
                </span>
                <span className="text-xs text-muted-foreground">
                  Professional Receipt Management
                </span>
              </div>
            </div>
          </div>

          {/* Center Section: Company Information */}
          {companyInfo && (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-6">
                <div className="text-lg font-medium text-foreground">
                  {companyInfo.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {companyInfo.phone}
                </div>
              </div>
            </div>
          )}

                      {/* Right Section: Account Profile */}
            <div className="flex items-center space-x-4">
              {/* Company Info for Mobile */}
              {companyInfo && (
                <div className="lg:hidden flex items-center text-sm">
                  <span className="font-medium text-foreground">{companyInfo.name}</span>
                </div>
              )}

              {/* Support Button */}
              {(user?.role === 'admin' || user?.role === 'cashier') && (
                <Button variant="ghost" size="sm" asChild>
                  <NavLink to="/support" className="flex items-center gap-2">
                    <Headphones className="h-4 w-4" />
                    <span className="hidden sm:inline">Support</span>
                  </NavLink>
                </Button>
              )}

              {/* User Account */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <NavLink to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <NavLink to="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </NavLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
        </div>


      </div>
    </nav>
  );
};