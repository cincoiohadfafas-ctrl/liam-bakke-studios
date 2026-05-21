import type { VercelRequest, VercelResponse } from "@vercel/node";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_BASE  = "https://api.spotify.com/v1";

async function getToken(): Promise<string> {
  const creds = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const artistId = process.env.SPOTIFY_ARTIST_ID;
  if (!artistId) return res.status(500).json({ error: "SPOTIFY_ARTIST_ID not set" });

  try {
    const token = await getToken();

    // Fetch latest singles + albums, sorted by release_date desc
    const albumsRes = await fetch(
      `${API_BASE}/artists/${artistId}/albums?include_groups=single,album&market=NO&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!albumsRes.ok) throw new Error(`Albums fetch failed: ${albumsRes.status}`);
    const albumsData = await albumsRes.json() as {
      items: Array<{
        id: string; name: string; release_date: string;
        images: Array<{ url: string; width: number }>;
        external_urls: { spotify: string };
        album_type: string;
      }>
    };

    // Sort by release date and take top 5
    const latest = albumsData.items
      .sort((a, b) => b.release_date.localeCompare(a.release_date))
      .slice(0, 5);

    // Fetch first track of each release to get duration
    const tracks = await Promise.all(
      latest.map(async (album) => {
        const tracksRes = await fetch(
          `${API_BASE}/albums/${album.id}/tracks?limit=1`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const tracksData = await tracksRes.json() as {
          items: Array<{ duration_ms: number; external_urls: { spotify: string } }>
        };
        const track = tracksData.items[0];
        const mins = Math.floor((track?.duration_ms ?? 0) / 60000);
        const secs = String(Math.floor(((track?.duration_ms ?? 0) % 60000) / 1000)).padStart(2, "0");

        return {
          id: album.id,
          name: album.name,
          type: album.album_type,
          releaseDate: album.release_date,
          artwork: album.images[0]?.url ?? "",
          duration: track ? `${mins}:${secs}` : null,
          spotifyUrl: track?.external_urls?.spotify ?? album.external_urls.spotify,
        };
      })
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    return res.status(200).json(tracks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch Spotify data" });
  }
}
