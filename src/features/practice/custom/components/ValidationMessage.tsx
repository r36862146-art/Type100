import { AlertCircle } from "lucide-react";

interface ValidationMessageProps {
  errors: string[];
}

export function ValidationMessage({ errors }: ValidationMessageProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 mt-2 text-destructive text-sm" role="alert" aria-live="polite">
      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>{err}</span>
        </div>
      ))}
    </div>
  );
}
