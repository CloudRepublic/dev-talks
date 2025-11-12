import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import type { PodcastFeed, Episode } from "@shared/schema";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import KeywordFilter from "@/components/KeywordFilter";
import EpisodeCard from "@/components/EpisodeCard";
import AudioPlayer from "@/components/AudioPlayer";
import PaginationControls from "@/components/PaginationControls";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePlayedEpisodes } from "@/hooks/usePlayedEpisodes";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, Check } from "lucide-react";

const EPISODES_PER_PAGE = 10;

type SortOption = "date-desc" | "date-asc";

export default function PodcastPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [showPlayed, setShowPlayed] = useState(false);

  const { togglePlayed, isPlayed } = usePlayedEpisodes();

  const { data: podcast, isLoading } = useQuery<PodcastFeed>({
    queryKey: ["/api/podcast"],
  });

  const allKeywords = useMemo(() => {
    if (!podcast) return [];
    const keywordSet = new Set<string>();
    const commonKeywords = [
      "AI", "Cloud", "DevOps", "Security", "Python", "C#", ".NET",
      "JavaScript", "Frontend", "Backend", "Data", "Azure", "AWS"
    ];
    
    podcast.episodes.forEach((episode) => {
      const text = `${episode.title} ${episode.description}`.toLowerCase();
      commonKeywords.forEach((keyword) => {
        if (text.includes(keyword.toLowerCase())) {
          keywordSet.add(keyword);
        }
      });
    });
    
    return Array.from(keywordSet).sort();
  }, [podcast]);

  const filteredAndSortedEpisodes = useMemo(() => {
    if (!podcast) return [];
    
    let episodes = podcast.episodes.filter((episode) => {
      const searchText = `${episode.title} ${episode.description}`.toLowerCase();
      const matchesSearch = searchQuery === "" || searchText.includes(searchQuery.toLowerCase());
      
      const matchesKeywords = selectedKeywords.length === 0 || selectedKeywords.every((keyword) =>
        searchText.includes(keyword.toLowerCase())
      );

      const matchesPlayedFilter = showPlayed || !isPlayed(episode.id);
      
      return matchesSearch && matchesKeywords && matchesPlayedFilter;
    });

    episodes.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        case "date-asc":
          return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
        default:
          return 0;
      }
    });
    
    return episodes;
  }, [podcast, searchQuery, selectedKeywords, sortBy, showPlayed, isPlayed]);

  const totalPages = Math.ceil(filteredAndSortedEpisodes.length / EPISODES_PER_PAGE);
  const paginatedEpisodes = filteredAndSortedEpisodes.slice(
    (currentPage - 1) * EPISODES_PER_PAGE,
    currentPage * EPISODES_PER_PAGE
  );

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header imageUrl={podcast?.imageUrl} title={podcast?.title} />
      
      <main className="container mx-auto max-w-6xl px-4 py-8 pb-32">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-32 w-32 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : podcast ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center space-y-4">
              {podcast.imageUrl && (
                <img
                  src={podcast.imageUrl}
                  alt={podcast.title}
                  className="h-64 w-64 rounded-lg object-cover"
                />
              )}
              <h2 className="font-display text-3xl font-bold text-center">{podcast.title}</h2>
              <p className="text-base font-medium text-muted-foreground text-center">
                {podcast.episodes.length} afleveringen
              </p>
              <div 
                className="text-muted-foreground prose prose-sm max-w-3xl w-full"
                dangerouslySetInnerHTML={{ __html: podcast.description }}
              />
            </div>

            <div className="space-y-4">
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
              
              {allKeywords.length > 0 && (
                <KeywordFilter
                  keywords={allKeywords}
                  selectedKeywords={selectedKeywords}
                  onToggleKeyword={toggleKeyword}
                  onClearAll={() => {
                    setSelectedKeywords([]);
                    setCurrentPage(1);
                  }}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {filteredAndSortedEpisodes.length} Aflevering{filteredAndSortedEpisodes.length !== 1 ? "en" : ""}
                  </h3>
                  {(searchQuery || selectedKeywords.length > 0 || !showPlayed) && filteredAndSortedEpisodes.length < podcast.episodes.length && (
                    <span className="text-sm text-muted-foreground">
                      (van {podcast.episodes.length} totaal)
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid="button-sort-menu"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("date-desc");
                          setCurrentPage(1);
                        }}
                        data-testid="sort-date-desc"
                      >
                        <Check className={`mr-2 h-4 w-4 ${sortBy === "date-desc" ? "opacity-100" : "opacity-0"}`} />
                        Nieuwste eerst
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSortBy("date-asc");
                          setCurrentPage(1);
                        }}
                        data-testid="sort-date-asc"
                      >
                        <Check className={`mr-2 h-4 w-4 ${sortBy === "date-asc" ? "opacity-100" : "opacity-0"}`} />
                        Oudste eerst
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowPlayed(!showPlayed);
                    setCurrentPage(1);
                  }}
                  className="h-auto p-0 text-sm font-medium hover:bg-transparent"
                  data-testid="button-toggle-played"
                >
                  {showPlayed ? "Verberg" : "Toon"} beluisterde afleveringen
                </Button>
              </div>

              {paginatedEpisodes.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    Geen afleveringen gevonden die voldoen aan je zoekcriteria.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Probeer je zoekopdracht aan te passen of filters te wissen.
                  </p>
                </Card>
              ) : (
                <>
                  <div className="space-y-4" data-testid="episodes-list">
                    <AnimatePresence mode="popLayout">
                      {paginatedEpisodes.map((episode, index) => (
                        <motion.div
                          key={episode.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <EpisodeCard
                            id={episode.id}
                            title={episode.title}
                            description={episode.description}
                            pubDate={episode.pubDate}
                            duration={episode.duration}
                            imageUrl={episode.imageUrl}
                            podLinkUrl={episode.podLinkUrl}
                            isPlayed={isPlayed(episode.id)}
                            onPlay={() => setCurrentEpisode(episode)}
                            onTogglePlayed={() => togglePlayed(episode.id)}
                            isAlternate={index % 2 === 1}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        ) : null}
      </main>

      {currentEpisode && (
        <AudioPlayer
          episodeTitle={currentEpisode.title}
          audioUrl={currentEpisode.audioUrl}
          imageUrl={currentEpisode.imageUrl}
          onClose={() => setCurrentEpisode(null)}
        />
      )}
    </div>
  );
}
