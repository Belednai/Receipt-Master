import React, { useState } from "react";
import { W3StyleSidebar } from "./W3StyleSidebar";
import { Navigation } from "./Navigation";
import { Button } from "./ui/button";
import { PanelLeft, X } from "lucide-react";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export const SidebarLayout = ({ children }: SidebarLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navigation - Full Width */}
      <div className="bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <PanelLeft className="h-5 w-5" />
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden lg:block flex-1">
            <Navigation />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Navigation />
          </div>
        </div>
      </div>

      {/* Content Area with Sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <W3StyleSidebar />
        </div>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full z-50">
              <W3StyleSidebar />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 h-8 w-8 bg-white rounded-full shadow-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}; 