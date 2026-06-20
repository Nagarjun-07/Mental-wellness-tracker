"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, LayoutDashboard, PenLine, Sparkles, LineChart } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Journal", href: "/journal", icon: PenLine },
  { name: "Companion", href: "/companion", icon: Brain },
  { name: "Insights", href: "/insights", icon: LineChart },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Sparkles className="h-6 w-6 text-primary group-hover:animate-pulse" />
              <span className="font-bold text-xl tracking-tight text-white/90">
                मनः<span className="text-primary font-light">सूत्र</span>
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-white",
                    isActive ? "text-primary" : "text-white/60"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline-block">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
