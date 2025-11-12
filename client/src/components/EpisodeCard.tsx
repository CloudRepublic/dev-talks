import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Clock, Check, X } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { useState } from "react";
import { formatDuration } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface EpisodeCardProps {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  duration?: string;
  imageUrl?: string;
  isPlayed: boolean;
  onPlay: () => void;
  onTogglePlayed: () => void;
}

export default function EpisodeCard({
  id,
  title,
  description,
  pubDate,
  duration,
  imageUrl,
  isPlayed,
  onPlay,
  onTogglePlayed,
}: EpisodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };
  
  const plainDescription = stripHtml(description);
  const shouldTruncate = plainDescription.length > maxLength;
  
  const getTruncatedHtml = (html: string, maxLen: number) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || "";
    
    if (text.length <= maxLen) return html;
    
    const truncated = text.slice(0, maxLen);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    
    let charCount = 0;
    const truncateNode = (node: Node): Node | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textContent = node.textContent || "";
        if (charCount + textContent.length <= maxLen) {
          charCount += textContent.length;
          return node.cloneNode(true);
        } else {
          const remaining = maxLen - charCount;
          if (remaining > 0) {
            const newNode = document.createTextNode(textContent.slice(0, remaining) + "...");
            charCount = maxLen;
            return newNode;
          }
          return null;
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const clone = element.cloneNode(false) as Element;
        for (let i = 0; i < node.childNodes.length && charCount < maxLen; i++) {
          const childClone = truncateNode(node.childNodes[i]);
          if (childClone) {
            clone.appendChild(childClone);
          }
        }
        return clone;
      }
      return null;
    };
    
    const resultDiv = document.createElement("div");
    for (let i = 0; i < tempDiv.childNodes.length && charCount < maxLen; i++) {
      const clone = truncateNode(tempDiv.childNodes[i]);
      if (clone) {
        resultDiv.appendChild(clone);
      }
    }
    
    return resultDiv.innerHTML;
  };

  const formattedDate = (() => {
    try {
      return format(new Date(pubDate), "d MMM yyyy", { locale: nl });
    } catch {
      return pubDate;
    }
  })();

  const formattedDuration = duration ? formatDuration(duration) : "";

  return (
    <Card className={`overflow-hidden hover-elevate transition-all duration-150 ${isPlayed ? 'opacity-60' : ''}`}>
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
                  data-testid={`button-play-${id}`}
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
              {formattedDuration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formattedDuration}</span>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={isExpanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div 
                  className="prose prose-sm max-w-none text-sm leading-relaxed text-foreground/80"
                  dangerouslySetInnerHTML={{ 
                    __html: isExpanded || !shouldTruncate 
                      ? description 
                      : getTruncatedHtml(description, maxLength)
                  }}
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between gap-2 pt-2">
              {shouldTruncate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-auto p-0 text-sm font-medium text-primary hover:bg-transparent"
                  data-testid="button-read-more"
                >
                  {isExpanded ? "Lees minder" : "Lees meer"}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onTogglePlayed}
                className="ml-auto h-auto gap-1.5 p-0 text-sm font-medium hover:bg-transparent"
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
          </div>
        </div>
      </Card>
  );
}
