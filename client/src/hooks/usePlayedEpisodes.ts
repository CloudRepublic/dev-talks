import { useState, useEffect } from "react";

const STORAGE_KEY = "podcast-played-episodes";
const TIMESTAMPS_KEY = "podcast-played-timestamps";

interface PlayedEpisodeData {
  [episodeId: string]: number;
}

export function usePlayedEpisodes() {
  const [playedEpisodes, setPlayedEpisodes] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [playedTimestamps, setPlayedTimestamps] = useState<PlayedEpisodeData>(() => {
    try {
      const stored = localStorage.getItem(TIMESTAMPS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(playedEpisodes)));
  }, [playedEpisodes]);

  useEffect(() => {
    localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(playedTimestamps));
  }, [playedTimestamps]);

  const togglePlayed = (episodeId: string) => {
    setPlayedEpisodes((prev) => {
      const next = new Set(prev);
      if (next.has(episodeId)) {
        next.delete(episodeId);
        setPlayedTimestamps((prevTimestamps) => {
          const nextTimestamps = { ...prevTimestamps };
          delete nextTimestamps[episodeId];
          return nextTimestamps;
        });
      } else {
        next.add(episodeId);
        setPlayedTimestamps((prevTimestamps) => ({
          ...prevTimestamps,
          [episodeId]: Date.now(),
        }));
      }
      return next;
    });
  };

  const markAsPlaying = (episodeId: string) => {
    if (!playedEpisodes.has(episodeId)) {
      setPlayedEpisodes((prev) => new Set(prev).add(episodeId));
    }
    setPlayedTimestamps((prev) => ({
      ...prev,
      [episodeId]: Date.now(),
    }));
  };

  const isPlayed = (episodeId: string) => playedEpisodes.has(episodeId);

  const getRecentlyPlayed = (limit: number = 5) => {
    return Object.entries(playedTimestamps)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);
  };

  return { togglePlayed, isPlayed, playedEpisodes, markAsPlaying, getRecentlyPlayed, playedTimestamps };
}
