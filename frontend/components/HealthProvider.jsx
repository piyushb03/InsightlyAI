"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

const HealthContext = createContext({ isAwake: true });

export function useHealth() {
  return useContext(HealthContext);
}

export function HealthProvider({ children }) {
  const [isAwake, setIsAwake] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Ping the health endpoint
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setIsAwake(true);
        }
      } catch (err) {
        setIsAwake(false);
      } finally {
        setHasChecked(true);
      }
    };
    checkHealth();
    
    if (!isAwake) {
      const interval = setInterval(checkHealth, 5000);
      return () => clearInterval(interval);
    }
  }, [isAwake]);

  // Protected paths that need the server to be awake
  const isProtectedPath = pathname?.startsWith("/dashboard") || 
                          pathname?.startsWith("/upload") || 
                          pathname?.startsWith("/login") || 
                          pathname?.startsWith("/signup");

  if (isProtectedPath && !isAwake) {
    return (
      <div className="fixed inset-0 bg-[#07060f] text-white flex flex-col items-center justify-center z-50">
        <div className="animate-blob absolute w-[400px] h-[400px] rounded-full bg-violet-700/20 blur-[120px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center glass-card p-10 max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl glass-strong flex items-center justify-center mb-6 ring-1 ring-violet-500/20">
            <Sparkles className="h-8 w-8 text-violet-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-3">Initializing AI Engine</h2>
          <p className="text-white/60 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
            Our secure servers are waking up from hibernation. This takes about 30 seconds on your first visit.
          </p>
          
          <div className="flex items-center gap-2 text-violet-400 text-sm font-medium bg-violet-500/10 px-4 py-2 rounded-full ring-1 ring-violet-500/20">
            <Loader2 className="h-4 w-4 animate-spin" />
            Establishing Secure Connection...
          </div>
        </div>
      </div>
    );
  }

  return (
    <HealthContext.Provider value={{ isAwake }}>
      {children}
      {/* Optional Status Indicator for Landing Page */}
      {hasChecked && !isProtectedPath && (
        <div className="fixed bottom-4 right-4 z-50 glass-card px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium border-white/10 shadow-xl backdrop-blur-md">
          <div className={`w-2 h-2 rounded-full ${isAwake ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-yellow-500 animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.6)]"}`} />
          {isAwake ? "Systems Operational" : "Waking AI Engine..."}
        </div>
      )}
    </HealthContext.Provider>
  );
}
