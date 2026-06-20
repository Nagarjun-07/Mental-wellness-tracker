"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, LayoutDashboard, PenLine, Sparkles, LineChart } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Journal", href: "/journal", icon: PenLine },
  { name: "Insights", href: "/insights", icon: LineChart },
  { name: "Companion", href: "/companion", icon: Brain },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r border-white/5 hidden md:flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="h-6 w-6 text-primary group-hover:animate-pulse" />
          <span className="font-bold text-2xl tracking-tight text-white/90">
            मनः<span className="text-primary font-light">सूत्र</span>
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-8 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Student</span>
            <span className="text-xs text-muted-foreground">Premium</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
