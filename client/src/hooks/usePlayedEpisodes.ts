import { useState, useEffect } from "react";

const STORAGE_KEY = "podcast-played-episodes";

export function usePlayedEpisodes() {
  const [playedEpisodes, setPlayedEpisodes] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(playedEpisodes)));
  }, [playedEpisodes]);

  const togglePlayed = (episodeId: string) => {
    setPlayedEpisodes((prev) => {
      const next = new Set(prev);
      if (next.has(episodeId)) {
        next.delete(episodeId);
      } else {
        next.add(episodeId);
      }
      return next;
    });
  };

  const isPlayed = (episodeId: string) => playedEpisodes.has(episodeId);

  return { togglePlayed, isPlayed, playedEpisodes };
}
