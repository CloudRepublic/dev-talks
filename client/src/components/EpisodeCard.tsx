import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Check, X, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";
import { formatDuration } from "@/lib/utils";

interface EpisodeCardProps {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  imageUrl?: string;
  podLinkUrl?: string;
  isPlayed: boolean;
  onPlay: () => void;
  onTogglePlayed: () => void;
  isAlternate?: boolean;
}

export default function EpisodeCard({
  id,
  title,
  description,
  pubDate,
  duration,
  imageUrl,
  podLinkUrl,
  isPlayed,
  onPlay,
  onTogglePlayed,
  isAlternate = false,
}: EpisodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  
  const plainDescription = stripHtml(description);
  const shouldTruncate = plainDescription.length > 150;

  const formattedDate = (() => {
    try {
      const date = new Date(pubDate);
      const daysDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        return formatDistanceToNow(date, { addSuffix: true, locale: nl });
      }
      
      return format(date, "d MMM yyyy", { locale: nl });
    } catch {
      return pubDate;
    }
  })();

  const formattedDuration = duration ? formatDuration(duration) : "";

  return (
    <Card className={`group overflow-hidden hover-elevate transition-all duration-150 ${isPlayed ? 'opacity-70' : ''} ${isAlternate ? 'bg-accent/5' : ''}`}>
        <div className="flex flex-col gap-4 p-6 sm:flex-row">
          <div className="relative flex-shrink-0">
            <div 
              className="relative h-32 w-32 overflow-hidden rounded-lg bg-muted cursor-pointer"
              onClick={onPlay}
              data-testid={`button-play-${id}`}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">DT</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <Play className="h-5 w-5 fill-current text-secondary-foreground" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h3 className="flex-1 min-w-0 sm:flex-initial font-display text-xl font-semibold leading-tight w-full sm:w-auto">
                {title}
              </h3>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePlayed}
                className="h-auto gap-1.5 px-2 py-1 text-sm font-medium text-primary dark:text-primary-foreground hover:bg-transparent flex-shrink-0 hidden sm:flex"
                data-testid={`button-toggle-played-${id}`}
              >
                {isPlayed ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Markeer als onbeluisterd</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Markeer als beluisterd</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formattedDate}</span>
              </div>
              {formattedDuration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formattedDuration}</span>
                </div>
              )}
            </div>

            <div 
              className={`prose prose-sm max-w-none text-sm leading-relaxed text-foreground/80 overflow-hidden ${
                isExpanded ? '' : 'h-10'
              }`}
              dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="flex flex-wrap items-center gap-2 pt-2">
              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-auto gap-1.5 px-2 py-1 text-sm font-medium text-primary dark:text-primary-foreground hover:bg-transparent"
                  data-testid="button-read-more"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3.5 w-3.5" />
                      <span>Lees minder</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3.5 w-3.5" />
                      <span>Lees meer</span>
                    </>
                  )}
                </Button>
              )}
              
              {podLinkUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-auto gap-1.5 px-2 py-1 text-sm font-medium text-primary dark:text-primary-foreground hover:bg-transparent"
                  data-testid={`link-podlink-${id}`}
                >
                  <a href={podLinkUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Luister met je favoriete app</span>
                    <span className="sm:hidden">Luister</span>
                  </a>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePlayed}
                className="h-auto gap-1.5 px-2 py-1 text-sm font-medium text-primary dark:text-primary-foreground hover:bg-transparent flex-shrink-0 sm:hidden"
                data-testid={`button-toggle-played-mobile-${id}`}
              >
                {isPlayed ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Onbeluisterd</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Beluisterd</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
  );
}
