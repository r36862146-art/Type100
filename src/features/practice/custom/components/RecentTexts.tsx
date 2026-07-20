import { useEffect, useState } from "react";
import { getRecentTexts, SavedCustomText } from "../services/storage";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface RecentTextsProps {
  onSelect: (text: string) => void;
}

export function RecentTexts({ onSelect }: RecentTextsProps) {
  const [recent, setRecent] = useState<SavedCustomText[]>([]);

  useEffect(() => {
    setRecent(getRecentTexts());
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Recent Custom Texts
      </h3>
      <div className="flex flex-col gap-2">
        {recent.map((item) => (
          <Button
            key={item.id}
            variant="outline"
            className="justify-start text-left truncate w-full h-auto py-3 px-4"
            onClick={() => onSelect(item.text)}
          >
            <span className="truncate w-full">{item.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
