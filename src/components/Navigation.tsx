import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Settings,
  LogOut,
  User,
  Headphones,
  Menu,
  X
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const getNavItems = (userRole?: string) => {
  // Return empty array since we're removing navigation items from top navbar
  return [];
};

export const Navigation = () => {
  const [companyInfo, setCompanyInfo] = useState<{ name: string; phone: string; website?: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Load company information
  useEffect(() => {
    const loadCompanyInfo = async () => {
      try {
        const settings = await getCompanySettings();
        if (settings) {
          setCompanyInfo({
            name: settings.name,
            phone: settings.phone,
            website: settings.logo // Using logo field as website
          });
        }
      } catch (error) {
        console.error('Failed to load company info:', error);
      }
    };

    loadCompanyInfo();
  }, []);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section: Logo and Brand */}
          <div className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <img 
                src={belednaiLogo} 
                alt="Receipt Master" 
                className="h-8 w-8 mr-3"
              />
              <div className="hidden sm:block">
                <span className="text-xl font-semibold text-foreground block leading-tight">
                  Receipt Master
                </span>
                <span className="text-xs text-muted-foreground leading-tight">
                  Professional Receipt Management
                </span>
              </div>
              <div className="sm:hidden">
                <span className="text-lg font-semibold text-foreground block leading-tight">
                  Receipt Master
                </span>
              </div>
            </div>
          </div>

          {/* Center Section: Company Information (Desktop Only) */}
          <div className="hidden lg:flex flex-1 items-center justify-center">
            {companyInfo ? (
              <div className="text-center space-y-1">
                <div className="text-base font-semibold text-foreground leading-tight">
                  {companyInfo.name}
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  {companyInfo.phone}
                </div>
                {companyInfo.website && (
                  <div className="text-xs text-muted-foreground leading-tight">
                    <a 
                      href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors underline decoration-dotted underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    >
                      {companyInfo.website}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-1">
                <div className="text-sm text-muted-foreground leading-tight">
                  Company details not configured
                </div>
                <div className="text-xs text-muted-foreground leading-tight">
                  <a 
                    href="/settings" 
                    className="hover:text-primary transition-colors underline decoration-dotted underline-offset-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    Configure in Settings
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Actions and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Support Button - Desktop */}
            {(user?.role === 'admin' || user?.role === 'cashier') && (
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="hidden sm:flex h-10 px-3"
              >
                <NavLink to="/support" className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  <span>Support</span>
                </NavLink>
              </Button>
            )}

            {/* User Account - Desktop */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
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
                    <NavLink to="/profile" className="flex items-center h-11">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/settings" className="flex items-center h-11">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive h-11">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="lg:hidden h-10 w-10 p-0"
                  aria-label="Open mobile menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <img 
                        src={belednaiLogo} 
                        alt="Receipt Master" 
                        className="h-8 w-8 mr-3"
                      />
                      <span className="text-lg font-semibold text-foreground">
                        Receipt Master
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="h-8 w-8 p-0"
                      aria-label="Close mobile menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Company Info - Mobile */}
                  {companyInfo && (
                    <div className="mb-6 p-4 bg-muted rounded-lg">
                      <div className="text-center space-y-2">
                        <div className="text-base font-semibold text-foreground">
                          {companyInfo.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {companyInfo.phone}
                        </div>
                        {companyInfo.website && (
                          <div className="text-sm text-muted-foreground">
                            <a 
                              href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors underline decoration-dotted underline-offset-2"
                            >
                              {companyInfo.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Mobile Navigation */}
                  <div className="flex-1 space-y-2">
                    {(user?.role === 'admin' || user?.role === 'cashier') && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start h-12 text-base"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <NavLink to="/support" className="flex items-center gap-3">
                          <Headphones className="h-5 w-5" />
                          <span>Support</span>
                        </NavLink>
                      </Button>
                    )}

                    {user && (
                      <>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12 text-base"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <NavLink to="/profile" className="flex items-center gap-3">
                            <User className="h-5 w-5" />
                            <span>Profile</span>
                          </NavLink>
                        </Button>

                        <Button 
                          variant="ghost" 
                          className="w-full justify-start h-12 text-base"
                          asChild
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <NavLink to="/settings" className="flex items-center gap-3">
                            <Settings className="h-5 w-5" />
                            <span>Settings</span>
                          </NavLink>
                        </Button>

                        <div className="pt-4 border-t">
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start h-12 text-base text-destructive hover:text-destructive"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span>Log out</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Footer */}
                  <div className="pt-4 border-t">
                    <div className="text-center text-sm text-muted-foreground">
                      <p>Receipt Master</p>
                      <p>Professional Receipt Management</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};