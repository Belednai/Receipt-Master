import React, { useState } from "react";
import { W3StyleSidebar } from "./W3StyleSidebar";
import { Navigation } from "./Navigation";
import { Button } from "./ui/button";
import { PanelLeft, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation - Single Instance */}
      <Navigation />

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block border-r border-border">
          <W3StyleSidebar />
        </div>

        {/* Sidebar - Mobile */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed top-20 left-4 z-40 h-10 w-10 bg-background border border-border shadow-lg"
              aria-label="Open sidebar menu"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              {/* Mobile Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <W3StyleSidebar />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 