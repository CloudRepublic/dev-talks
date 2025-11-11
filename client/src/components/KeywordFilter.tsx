import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface KeywordFilterProps {
  keywords: string[];
  selectedKeywords: string[];
  onToggleKeyword: (keyword: string) => void;
  onClearAll: () => void;
}

export default function KeywordFilter({
  keywords,
  selectedKeywords,
  onToggleKeyword,
  onClearAll,
}: KeywordFilterProps) {
  const hasSelection = selectedKeywords.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Filter by Keywords</h3>
        {hasSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
            data-testid="button-clear-filters"
          >
            Clear all
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => {
          const isSelected = selectedKeywords.includes(keyword);
          return (
            <Badge
              key={keyword}
              variant={isSelected ? "default" : "secondary"}
              className="cursor-pointer hover-elevate active-elevate-2"
              onClick={() => onToggleKeyword(keyword)}
              data-testid={`badge-keyword-${keyword.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {keyword}
              {isSelected && <X className="ml-1 h-3 w-3" />}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
