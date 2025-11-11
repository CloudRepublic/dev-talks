import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import type { PodcastFeed, Episode } from "@shared/schema";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import KeywordFilter from "@/components/KeywordFilter";
import EpisodeCard from "@/components/EpisodeCard";
import AudioPlayer from "@/components/AudioPlayer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function PodcastPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

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

  const filteredEpisodes = useMemo(() => {
    if (!podcast) return [];
    
    return podcast.episodes.filter((episode) => {
      const searchText = `${episode.title} ${episode.description}`.toLowerCase();
      const matchesSearch = searchQuery === "" || searchText.includes(searchQuery.toLowerCase());
      
      const matchesKeywords = selectedKeywords.length === 0 || selectedKeywords.every((keyword) =>
        searchText.includes(keyword.toLowerCase())
      );
      
      return matchesSearch && matchesKeywords;
    });
  }, [podcast, searchQuery, selectedKeywords]);

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
                    <Skeleton className="h-24 w-24 rounded-lg" />
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
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {podcast.imageUrl && (
                  <img
                    src={podcast.imageUrl}
                    alt={podcast.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h2 className="font-display text-3xl font-bold">{podcast.title}</h2>
                  <p className="mt-1 text-muted-foreground">{podcast.description}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              
              {allKeywords.length > 0 && (
                <KeywordFilter
                  keywords={allKeywords}
                  selectedKeywords={selectedKeywords}
                  onToggleKeyword={toggleKeyword}
                  onClearAll={() => setSelectedKeywords([])}
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {filteredEpisodes.length} Episode{filteredEpisodes.length !== 1 ? "s" : ""}
                </h3>
              </div>

              {filteredEpisodes.length === 0 ? (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    No episodes found matching your search criteria.
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try adjusting your search or clearing some filters.
                  </p>
                </Card>
              ) : (
                <div className="space-y-4" data-testid="episodes-list">
                  {filteredEpisodes.map((episode) => (
                    <EpisodeCard
                      key={episode.id}
                      title={episode.title}
                      description={episode.description}
                      pubDate={episode.pubDate}
                      duration={episode.duration}
                      imageUrl={episode.imageUrl}
                      onPlay={() => setCurrentEpisode(episode)}
                    />
                  ))}
                </div>
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
