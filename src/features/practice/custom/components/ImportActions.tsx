import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";

interface ImportActionsProps {
  onImportClick?: () => void;
  onClearClick?: () => void;
  disabled?: boolean;
}

export function ImportActions({ onImportClick, onClearClick, disabled }: ImportActionsProps) {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onClearClick}
        disabled={disabled || !onClearClick}
        aria-label="Clear custom text"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
      <Button 
        variant="outline" 
        onClick={onImportClick}
        disabled={disabled || !onImportClick}
        aria-label="Import text file (Coming soon)"
        title="Import file (Coming soon)"
      >
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
    </div>
  );
}
