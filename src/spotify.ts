import axios from "axios";

const CLIENT_ID = "your_spotify_client_id";
const CLIENT_SECRET = "your_spotify_client_secret";

async function getSpotifyToken(): Promise<string> {
  const res = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${CLIENT_ID}:${CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return res.data.access_token;
}

export async function fetchSpotifyMetadata(
  trackUrl: string
): Promise<{ title: string; artist: string }> {
  const token = await getSpotifyToken();
  const trackId = trackUrl.split("/").pop();

  if (!trackId) {
    throw new Error("Invalid Spotify URL");
  }

  const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = res.data;
  return {
    title: data.name,
    artist: data.artists[0].name,
  };
}
