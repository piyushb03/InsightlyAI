import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {/*
        On mobile the sidebar becomes a fixed top bar (h-14) + a slide-in drawer.
        We add pt-14 on mobile so the content doesn't sit under the top bar.
        On md+ the sidebar is static and no top-bar exists, so no padding needed.
      */}
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8 pt-[calc(3.5rem+1.5rem)] md:pt-8">
        {children}
      </main>
    </div>
  );
}
