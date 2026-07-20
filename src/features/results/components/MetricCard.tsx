import React, { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
        "flex flex-col items-start justify-center p-4 rounded-xl bg-card text-card-foreground shadow-sm border border-border/40",
        className
      )}
      title={tooltip}
      role="group"
      aria-label={label}
    >
      <span className="text-sm font-medium text-muted-foreground mb-1">
        {label}
      </span>
      <span className="text-2xl font-bold tracking-tight">
        {value}
      </span>
    </div>
  );
});
