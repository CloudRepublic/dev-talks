import { z } from "zod";

export const episodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  pubDate: z.string(),
  duration: z.string().optional(),
  audioUrl: z.string(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
});

export type Episode = z.infer<typeof episodeSchema>;

export const podcastFeedSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  episodes: z.array(episodeSchema),
});

export type PodcastFeed = z.infer<typeof podcastFeedSchema>;
