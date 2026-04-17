"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  Upload,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboards", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Data", icon: Upload },
];

// ── Sidebar content (shared between mobile & desktop) ──────────────────────
function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => logout());
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/5 bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="p-1.5 rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30">
            <BarChart2 className="h-4 w-4 text-violet-400" />
          </div>
          <span className="font-bold text-sm">InsightlyAI</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
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

      {/* Sign out */}
      <div className="border-t border-white/5 p-3">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full justify-start gap-3 text-white/30 hover:text-white/60 hover:bg-white/5"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Sign out
        </Button>
      </div>
    </aside>
  );
}

// ── Main Sidebar export ─────────────────────────────────────────────────────
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <SidebarContent onClose={null} />
      </div>

      {/* Mobile: fixed top bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-white/5 bg-sidebar fixed top-0 left-0 right-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/20 ring-1 ring-violet-500/30">
            <BarChart2 className="h-4 w-4 text-violet-400" />
          </div>
          <span className="font-bold text-sm">InsightlyAI</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile: backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Mobile: slide-in drawer */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent onClose={() => setOpen(false)} />
      </div>
    </>
  );
}
