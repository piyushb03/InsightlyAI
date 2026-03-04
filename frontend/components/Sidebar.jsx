"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Upload, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboards", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Data", icon: Upload },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/5 bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b border-white/5 px-4">
        <div className="p-1.5 rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30">
          <BarChart2 className="h-4 w-4 text-violet-400" />
        </div>
        <span className="font-bold text-sm">InsightlyAI</span>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(href)
                ? "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20"
                : "text-white/40 hover:bg-white/5 hover:text-white/70"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/5 p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-white/30 hover:text-white/60 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
