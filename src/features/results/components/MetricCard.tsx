import React, { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Info } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  label: string;
  value: ReactNode;
  tooltip?: string;
  className?: string;
}

export const MetricCard = React.memo(function MetricCard({
  label,
  value,
  tooltip,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-start justify-center p-4 rounded-xl bg-card text-card-foreground shadow-sm border border-border/40 group",
        className
      )}
      role="group"
      aria-label={label}
    >
      <div className="flex items-center gap-1.5 mb-1 cursor-help">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {tooltip && (
          <>
            <Info className="w-3.5 h-3.5 text-muted-foreground/60 transition-colors group-hover:text-primary" />
            <div className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border text-center pointer-events-none">
              {tooltip}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-b border-r transform rotate-45"></div>
            </div>
          </>
        )}
      </div>
      <span className="text-2xl font-bold tracking-tight">
        {value}
      </span>
    </div>
  );
});
