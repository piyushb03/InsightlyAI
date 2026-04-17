import Sidebar from "@/components/Sidebar";

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8 pt-[calc(3.5rem+1.5rem)] md:pt-8">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
