import { spawn } from "child_process";
import { Response } from "express";
import path from "path";

export async function downloadFromYouTube(
  searchQuery: string,
  res: Response
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Path to the yt-dlp __main__.py script
    const ytDlpPath = path.resolve(__dirname, "./lib/yt-dlp/__main__.py");

    // Command to run yt-dlp
    const args = [
      ytDlpPath,
      "-f",
      "bestaudio",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--no-playlist",
      `ytsearch:${searchQuery}`,
      "-o",
      "-",
    ];

    console.log(`Streaming audio for: ${searchQuery}`);

    // Spawn the yt-dlp process
    const ytDlpProcess = spawn("python", args);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${searchQuery}.mp3"`
    );

    ytDlpProcess.stdout.pipe(res);

    ytDlpProcess.stderr.on("data", (data) => {
      console.error(`yt-dlp : ${data}`);
    });

    ytDlpProcess.on("error", (err) => {
      console.error(`Failed to start yt-dlp: ${err}`);
      res.status(500).send("Internal Server Error");
    });

    ytDlpProcess.on("close", (code) => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code ${code}`);
        res.status(500).send("Failed to stream audio");
      }
    });
  });
}
