import React, { useState } from "react";
import { Flag } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";

interface FinishTestButtonProps {
  onFinish: () => void;
  mode: "practice" | "exam";
  className?: string;
}

export function FinishTestButton({ onFinish, mode, className }: FinishTestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const title = mode === "exam" ? "Submit Exam?" : "Finish Practice?";
  const description = mode === "exam"
    ? "Once submitted, you cannot continue this attempt."
    : "Your current typing session will end and your results will be calculated.";
  const confirmText = mode === "exam" ? "Submit Exam" : "Finish Practice";
  const cancelText = mode === "exam" ? "Cancel" : "Continue Typing";

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        title="Finish Test"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm",
          "bg-background/80 backdrop-blur border border-border/50",
          "hover:bg-primary hover:text-primary-foreground hover:border-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className
        )}
      >
        <Flag className="w-4 h-4" />
        <span className="hidden sm:inline">{mode === "exam" ? "Submit" : "Finish"}</span>
      </button>

      <ConfirmDialog
        isOpen={isOpen}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        onConfirm={() => {
          setIsOpen(false);
          onFinish();
        }}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}
