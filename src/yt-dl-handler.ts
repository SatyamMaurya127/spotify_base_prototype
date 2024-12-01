import { exec } from "child_process";
import path from "path";

export async function downloadFromYouTube(searchQuery: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Path to the yt-dlp __main__.py script
    const ytDlpPath = path.resolve(__dirname, "./lib/yt-dlp/__main__.py");

    // Command to run yt-dlp
    const command = `python ${ytDlpPath} -f bestaudio/best "ytsearch:${searchQuery}" -o "downloads/%(title)s.%(ext)s"`;

    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${stderr}`);
        reject(stderr);
      } else {
        console.log(`Output: ${stdout}`);
        resolve();
      }
    });
  });
}
