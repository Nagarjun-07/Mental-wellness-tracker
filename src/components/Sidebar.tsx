"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Brain, LayoutDashboard, Sparkles, LineChart, MessageSquare } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: LayoutDashboard },
  { name: "Insights", href: "/insights", icon: LineChart },
  { name: "Companion", href: "/companion", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 glass border-r border-white/5 hidden lg:flex flex-col relative z-50">
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
                aria-label={`Navigate to ${item.name}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 border border-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Floating Bottom Dock */}
      <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-50 glass rounded-full border border-white/10 px-6 py-4 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
              <Link
              key={item.name}
              href={item.href}
              aria-label={`Navigate to ${item.name}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-white/40 hover:text-white/80"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
