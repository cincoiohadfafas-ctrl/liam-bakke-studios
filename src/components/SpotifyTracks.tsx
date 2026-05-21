import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";

type Track = {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  artwork: string;
  duration: string | null;
  spotifyUrl: string;
};

export function SpotifyTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/spotify")
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setTracks(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <section className="py-20 px-5" id="musikk">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Music2 className="h-6 w-6" style={{ color: "oklch(0.68 0.16 168)" }} />
          <h2 className="text-2xl font-display font-bold">Siste utgivelser</h2>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse"
                style={{ background: "oklch(0.20 0.05 280 / 0.5)" }} />
            ))}
          </div>
        )}

        {error && (
          <p className="text-sm" style={{ color: "oklch(0.60 0.04 265)" }}>
            Kunne ikke hente Spotify-data.
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map(track => (
              <iframe
                key={track.id}
                src={`https://open.spotify.com/embed/album/${track.id}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                style={{
                  borderRadius: "12px",
                  border: "none",
                  display: "block",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
