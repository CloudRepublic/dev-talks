import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  episodeCount?: number;
}

export default function Header({ imageUrl, title, description, episodeCount }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title || "Dev Talks"}
                className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">DT</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-bold">{title || "Dev Talks"}</h1>
              {episodeCount !== undefined && (
                <p className="text-xs text-muted-foreground mb-1">
                  {episodeCount} Afleveringen
                </p>
              )}
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {stripHtml(description)}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
