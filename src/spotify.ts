import axios from "axios";
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getSpotifyToken(): Promise<string> {
  let buffer = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",

      new URLSearchParams({ grant_type: "client_credentials" }).toString(),
      {
        headers: {
          Authorization: `Basic ${buffer}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data.access_token;
  } catch (er: any) {
    console.log(er);
    return "";
  }
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
  console.log("token", token);
  return {
    title: data.name,
    artist: data.artists[0].name,
  };
}
