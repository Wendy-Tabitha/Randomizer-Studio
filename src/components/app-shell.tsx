"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNavigation } from "@/components/main-navigation";
import { Shuffle } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  // Get sidebar state from cookie or default to open
  const [defaultOpen, setDefaultOpen] = React.useState(true);

  React.useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('sidebar_state='))
      ?.split('=')[1];
    if (cookieValue) {
      setDefaultOpen(cookieValue === 'true');
    }
  }, []);


  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarRail />
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <MainNavigation />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-2 md:hidden">
             <Shuffle className="h-6 w-6 text-primary" />
             <span className="font-headline text-lg font-semibold">Randorium</span>
          </div>
          <div className="flex-1" />
          {/* Add user menu or other header items here if needed */}
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
