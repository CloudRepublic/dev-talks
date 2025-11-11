import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface EpisodeCardProps {
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  imageUrl?: string;
  onPlay: () => void;
}

export default function EpisodeCard({
  title,
  description,
  pubDate,
  duration,
  imageUrl,
  onPlay,
}: EpisodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const shouldTruncate = description.length > maxLength;
  const displayDescription = isExpanded || !shouldTruncate
    ? description
    : description.slice(0, maxLength) + "...";

  const formattedDate = (() => {
    try {
      return format(new Date(pubDate), "MMM d, yyyy");
    } catch {
      return pubDate;
    }
  })();

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-150">
      <div className="flex flex-col gap-4 p-6 sm:flex-row">
        <div className="relative flex-shrink-0">
          <div className="group relative h-24 w-24 overflow-hidden rounded-lg bg-muted">
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
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full"
                onClick={onPlay}
                data-testid={`button-play-${title.slice(0, 20)}`}
              >
                <Play className="h-5 w-5 fill-current" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            {duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">
            {displayDescription}
          </p>

          {shouldTruncate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-auto p-0 text-sm font-medium text-primary hover:bg-transparent"
              data-testid="button-read-more"
            >
              {isExpanded ? "Read less" : "Read more"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
