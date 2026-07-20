"use client";

import React from "react";
import { useSettings } from "../store";
import { analytics } from "../../analytics/events";
import { cn } from "@/lib/utils";
import { Check, Monitor, Moon, Sun, Type, Volume2, VolumeX, Keyboard } from "lucide-react";

export function SettingsPanel({ className }: { className?: string }) {
  const settings = useSettings();

  const handleUpdate = (key: string, value: any) => {
    settings.updateSettings({ [key]: value });
    analytics.trackSettingsChanged({ settingKey: key, newValue: value });
  };

  return (
    <div className={cn("w-full max-w-3xl mx-auto space-y-8", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Preferences</h2>
        <p className="text-muted-foreground text-sm">
          Customize your practice and simulation environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="space-y-4 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Monitor className="w-5 h-5" />
            <h3>Appearance</h3>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Theme</label>
            <div className="flex gap-2">
              {["light", "dark", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => handleUpdate("theme", t)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
                    settings.theme === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:bg-muted"
                  )}
                >
                  {t === "light" && <Sun className="w-4 h-4" />}
                  {t === "dark" && <Moon className="w-4 h-4" />}
                  {t === "system" && <Monitor className="w-4 h-4" />}
                  <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-muted-foreground">Accessibility</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded border",
                  settings.reduceMotion ? "bg-primary border-primary" : "border-muted-foreground"
                )}>
                  {settings.reduceMotion && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.reduceMotion}
                  onChange={(e) => handleUpdate("reduceMotion", e.target.checked)}
                />
                <span className="text-sm font-medium">Reduce Animations</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded border",
                  settings.highContrast ? "bg-primary border-primary" : "border-muted-foreground"
                )}>
                  {settings.highContrast && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.highContrast}
                  onChange={(e) => handleUpdate("highContrast", e.target.checked)}
                />
                <span className="text-sm font-medium">High Contrast Mode</span>
              </label>
            </div>
          </div>
        </div>

        {/* Typing Interface */}
        <div className="space-y-4 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Type className="w-5 h-5" />
            <h3>Typing Interface</h3>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Typing Font</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "georgia", label: "Georgia (Official)" },
                { id: "times", label: "Times New Roman" },
                { id: "monospace", label: "Monospace" },
                { id: "inter", label: "Modern Sans" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleUpdate("typingFont", f.id)}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-sm font-medium transition-colors text-left truncate",
                    settings.typingFont === f.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 hover:bg-muted"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-sm font-medium text-muted-foreground flex justify-between">
              <span>Font Size</span>
              <span className="text-foreground">{settings.fontSizePx}px</span>
            </label>
            <input
              type="range"
              min="16"
              max="32"
              step="2"
              value={settings.fontSizePx}
              onChange={(e) => handleUpdate("fontSizePx", parseInt(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        {/* Audio & Interaction */}
        <div className="space-y-4 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Volume2 className="w-5 h-5" />
            <h3>Audio & Feedback</h3>
          </div>

          <label className="flex items-center justify-between p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-muted-foreground" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
              <span className="text-sm font-medium">Typewriter Sounds</span>
            </div>
            <div className={cn(
              "w-11 h-6 rounded-full relative transition-colors",
              settings.soundEnabled ? "bg-primary" : "bg-muted-foreground/30"
            )}>
              <div className={cn(
                "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                settings.soundEnabled ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.soundEnabled}
              onChange={(e) => handleUpdate("soundEnabled", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-border/50 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Keyboard className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Keyboard Shortcuts</span>
            </div>
            <div className={cn(
              "w-11 h-6 rounded-full relative transition-colors",
              settings.keyboardShortcuts ? "bg-primary" : "bg-muted-foreground/30"
            )}>
              <div className={cn(
                "absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform",
                settings.keyboardShortcuts ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.keyboardShortcuts}
              onChange={(e) => handleUpdate("keyboardShortcuts", e.target.checked)}
            />
          </label>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button 
          onClick={settings.resetSettings}
          className="text-sm text-destructive hover:underline px-4 py-2 font-medium"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
