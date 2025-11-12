import type { Express } from "express";
import { createServer, type Server } from "http";
import Parser from "rss-parser";

const RSS_FEED_URL = "https://rss.buzzsprout.com/793019.rss";

export async function registerRoutes(app: Express): Promise<Server> {
  const parser = new Parser({
    customFields: {
      item: [
        ['itunes:duration', 'duration'],
        ['enclosure', 'enclosure'],
      ]
    }
  });

  app.get("/api/podcast", async (req, res) => {
    try {
      const feed = await parser.parseURL(RSS_FEED_URL);
      
      const episodes = feed.items.map((item, index) => ({
        id: item.guid || `episode-${index}`,
        title: item.title || "",
        description: item.content || (item as any)['content:encoded'] || item.contentSnippet || "",
        pubDate: item.pubDate || "",
        duration: (item as any).duration || "",
        audioUrl: (item as any).enclosure?.url || "",
        imageUrl: (item as any).itunes?.image || feed.itunes?.image || "",
        link: item.link || "",
      }));

      res.json({
        title: feed.title || "Dev Talks",
        description: feed.description || "",
        imageUrl: feed.itunes?.image || "",
        episodes,
      });
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      res.status(500).json({ error: "Failed to fetch podcast feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
