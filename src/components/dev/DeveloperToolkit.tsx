"use client";

import React, { useState, useEffect } from "react";
import { featureFlags, FeatureFlagKey } from "@/core/flags/FeatureFlagManager";
import { perfMonitor } from "@/core/monitoring/PerformanceMonitor";
import { pluginManager } from "@/plugins";
import { Wrench, X, Activity, Flag, Database, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function DeveloperToolkit() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"flags" | "perf" | "plugins" | "storage">("flags");
  const [isMounted, setIsMounted] = useState(false);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [flags, setFlags] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsMounted(true);
    setFlags(featureFlags.getAll());
    
    const interval = setInterval(() => {
      if (isOpen) {
        perfMonitor.captureMemorySnapshot();
        setMetrics(perfMonitor.getMetrics().reverse().slice(0, 10)); // last 10
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (process.env.NODE_ENV !== "development") return null;
  if (!isMounted) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-amber-500 text-white rounded-full shadow-2xl hover:scale-105 transition-transform z-[9999]"
        title="Developer Toolkit"
      >
        <Wrench className="w-5 h-5" />
      </button>
    );
  }

  const toggleFlag = (key: string) => {
    const current = featureFlags.getState(key as FeatureFlagKey);
    const next = current === "Enabled" ? "Disabled" : "Enabled";
    featureFlags.setOverride(key as FeatureFlagKey, next);
    setFlags(featureFlags.getAll());
  };

  const handleResetStorage = () => {
    if (window.confirm("Clear all localStorage? This cannot be undone.")) {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-card border border-border/50 shadow-2xl rounded-2xl overflow-hidden z-[9999] flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-3 bg-muted/50 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-sm">Developer Toolkit</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex text-xs font-semibold border-b border-border/50 bg-muted/20">
        <button onClick={() => setActiveTab("flags")} className={cn("flex-1 p-2 border-b-2", activeTab === "flags" ? "border-amber-500 text-amber-500" : "border-transparent text-muted-foreground")}>Flags</button>
        <button onClick={() => setActiveTab("perf")} className={cn("flex-1 p-2 border-b-2", activeTab === "perf" ? "border-amber-500 text-amber-500" : "border-transparent text-muted-foreground")}>Perf</button>
        <button onClick={() => setActiveTab("plugins")} className={cn("flex-1 p-2 border-b-2", activeTab === "plugins" ? "border-amber-500 text-amber-500" : "border-transparent text-muted-foreground")}>Plugins</button>
        <button onClick={() => setActiveTab("storage")} className={cn("flex-1 p-2 border-b-2", activeTab === "storage" ? "border-amber-500 text-amber-500" : "border-transparent text-muted-foreground")}>Storage</button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 text-sm">
        {activeTab === "flags" && (
          <div className="space-y-3">
            {Object.entries(flags).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-xs">{key}</span>
                <button
                  onClick={() => toggleFlag(key)}
                  className={cn("px-2 py-1 rounded text-xs font-bold", val === "Enabled" ? "bg-green-500/20 text-green-600" : val === "Disabled" ? "bg-red-500/20 text-red-600" : "bg-blue-500/20 text-blue-600")}
                >
                  {val}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "perf" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-4">Latest 10 metrics. Auto-updates.</p>
            {metrics.length === 0 ? <p className="text-xs italic">No metrics recorded yet.</p> : metrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono border-b border-border/20 py-1">
                <span>{m.type}</span>
                {m.durationMs ? <span>{m.durationMs.toFixed(1)}ms</span> : <span>{m.memoryUsageMB}MB</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === "plugins" && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">Registered Plugins</p>
            {pluginManager.getAllPlugins().map(p => (
              <div key={p.id} className="p-2 border rounded-md">
                <div className="font-bold flex items-center justify-between">
                  <span>{p.organization}</span>
                  <span className="px-2 py-0.5 bg-muted rounded-full text-xs font-mono">{p.id}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{p.profiles.length} profiles registered</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "storage" && (
          <div className="space-y-3">
            <button onClick={handleResetStorage} className="w-full py-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-md font-bold flex items-center justify-center gap-2">
              <RefreshCcw className="w-4 h-4" /> Reset LocalStorage
            </button>
            <p className="text-xs text-muted-foreground text-center">This will clear all settings, practice history, and unlocked achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
}
