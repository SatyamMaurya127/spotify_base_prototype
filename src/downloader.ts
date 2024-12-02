import express from "express";
import { fetchSpotifyMetadata } from "./spotify";
import { downloadFromYouTube } from "./yt-dl-handler";

const router = express.Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { spotifyUrl } = req.body;
    console.log(spotifyUrl);

    if (!spotifyUrl) {
      return res.status(400).json({ error: "Spotify URL is required" });
    }

    // Step 1: Fetch Spotify Metadata
    const metadata = await fetchSpotifyMetadata(spotifyUrl);
    console.log(`Metadata fetched: ${metadata.title} by ${metadata.artist}`);

    // Step 2: Use yt-dlp to download
    const searchQuery = `${metadata.title} ${metadata.artist}`;
    try {
      downloadFromYouTube(searchQuery, res);
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: "Failed to stream audio" });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to process download" });
  }
});

export default router;
