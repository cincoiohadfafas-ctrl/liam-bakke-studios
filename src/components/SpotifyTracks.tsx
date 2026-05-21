import { useEffect, useState } from "react";
import { Music2, Clock, ExternalLink, Play } from "lucide-react";

type Track = {
  id: string;
  name: string;
  type: string;
  releaseDate: string;
  artwork: string;
  duration: string | null;
  spotifyUrl: string;
};

const API_URL = import.meta.env.DEV
  ? "/api/spotify"
  : "/api/spotify";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("nb-NO", { year: "numeric", month: "short" });
}

export function SpotifyTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(API_URL)
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
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
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
          <div className="space-y-3">
            {tracks.map((track, i) => (
              <a
                key={track.id}
                href={track.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-xl p-4 transition-all group"
                style={{
                  background: "oklch(0.18 0.05 280 / 0.6)",
                  border: "1px solid oklch(0.32 0.06 280 / 0.4)",
                  backdropFilter: "blur(12px)",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "oklch(0.50 0.12 280 / 0.6)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.32 0.06 280 / 0.4)")}
              >
                {/* Rank */}
                <span className="text-sm font-mono w-5 shrink-0 text-center"
                  style={{ color: "oklch(0.45 0.04 265)" }}>
                  {i + 1}
                </span>

                {/* Artwork + play button overlay */}
                <div className="relative h-12 w-12 shrink-0 group/art">
                  {track.artwork ? (
                    <img src={track.artwork} alt={track.name}
                      className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ background: "oklch(0.22 0.06 280)" }}>
                      <Music2 className="h-5 w-5" style={{ color: "oklch(0.50 0.04 265)" }} />
                    </div>
                  )}
                  <a href={track.spotifyUrl} target="_blank" rel="noreferrer"
                    className="absolute inset-0 rounded-lg flex items-center justify-center opacity-0 group-hover/art:opacity-100 transition-opacity"
                    style={{ background: "black/60" }}
                    onClick={e => e.stopPropagation()}>
                    <Play className="h-5 w-5 fill-white text-white" />
                  </a>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate text-sm group-hover:text-white transition-colors"
                    style={{ color: "oklch(0.92 0.02 240)" }}>
                    {track.name}
                  </p>
                  <p className="text-xs mt-0.5 capitalize"
                    style={{ color: "oklch(0.55 0.04 265)" }}>
                    {track.type === "single" ? "Single" : "Album"} · {formatDate(track.releaseDate)}
                  </p>
                </div>

                {/* Duration */}
                {track.duration && (
                  <div className="flex items-center gap-1.5 shrink-0"
                    style={{ color: "oklch(0.55 0.04 265)" }}>
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs font-mono">{track.duration}</span>
                  </div>
                )}

                {/* External link icon */}
                <ExternalLink className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                  style={{ color: "oklch(0.68 0.16 168)" }} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
