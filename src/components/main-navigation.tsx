"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Dices, ScrollText, Shuffle } from "lucide-react";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { href: "/password-generator", label: "Password Generator", icon: KeyRound },
  { href: "/dice-roller", label: "Dice Roller", icon: Dices },
  { href: "/writing-prompts", label: "Writing Prompts", icon: ScrollText },
];

export function MainNavigation() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <Shuffle className="h-8 w-8 text-primary" />
          <h1
            className={cn(
              "text-2xl font-headline font-semibold text-foreground transition-opacity duration-300",
              open ? "opacity-100" : "opacity-0"
            )}
          >
            Randorium
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1 px-3">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: "right", align: "center" }}
              className="justify-start"
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarFooter className="p-4 mt-auto">
        <div className={cn("text-xs text-muted-foreground transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}>
          <p>&copy; {new Date().getFullYear()} Randorium</p>
          <p>All randomness served fresh.</p>
        </div>
      </SidebarFooter>
    </>
  );
}
