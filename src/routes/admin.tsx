import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Lock, CheckCircle, Loader2 } from "lucide-react";
import logoFull from "@/assets/logo-full.png";

const DAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const MONTHS = [
  "Januar","Februar","Mars","April","Mai","Juni",
  "Juli","August","September","Oktober","November","Desember",
];

function toStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function getFirstWeekday(y: number, m: number) {
  const day = new Date(y, m, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export function AdminPage() {
  const [password, setPassword]       = useState("");
  const [authed, setAuthed]           = useState(false);
  const [authError, setAuthError]     = useState("");
  const [checking, setChecking]       = useState(false);
  const [blocked, setBlocked]         = useState<string[]>([]);
  const [savedPw, setSavedPw]         = useState("");
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState("");
  const [month, setMonth]             = useState(() => {
    const n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() };
  });

  const today = toStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // Load blocked dates
  const loadDates = useCallback(async () => {
    const r = await fetch("/api/blocked-dates");
    const data = await r.json();
    setBlocked(data.dates ?? []);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setAuthError("");
    const r = await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      setSavedPw(password);
      await loadDates();
      setAuthed(true);
    } else {
      setAuthError("Feil passord. Prøv igjen.");
    }
    setChecking(false);
  }

  async function toggleDate(dateStr: string) {
    const next = blocked.includes(dateStr)
      ? blocked.filter(d => d !== dateStr)
      : [...blocked, dateStr];
    setBlocked(next);
    setSaving(true);
    await fetch("/api/blocked-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: savedPw, dates: next }),
    });
    setSaving(false);
    setToast("Lagret");
    setTimeout(() => setToast(""), 1800);
  }

  // Build calendar grid
  const firstWeekday = getFirstWeekday(month.y, month.m);
  const totalDays    = daysInMonth(month.y, month.m);
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    setMonth(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
  }
  function nextMonth() {
    setMonth(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });
  }

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{ background: "oklch(0.13 0.04 280)" }}
      >
        <div
          className="w-full max-w-sm rounded-2xl border p-8"
          style={{
            background: "oklch(0.18 0.05 280 / 0.8)",
            borderColor: "oklch(0.32 0.06 280 / 0.5)",
          }}
        >
          <img src={logoFull} alt="Liam Bakke Studios" className="h-7 mb-8 opacity-80"
            style={{ filter: "invert(1)" }} />
          <div className="flex items-center gap-2 mb-6">
            <Lock className="h-4 w-4" style={{ color: "oklch(0.68 0.16 168)" }} />
            <span className="text-sm font-semibold" style={{ color: "oklch(0.90 0.02 265)" }}>
              Admin — Bookingkalender
            </span>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Passord"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: "oklch(0.14 0.04 280)",
                border: "1px solid oklch(0.32 0.06 280 / 0.6)",
                color: "oklch(0.90 0.02 265)",
              }}
              autoFocus
            />
            {authError && (
              <p className="text-xs" style={{ color: "oklch(0.65 0.18 25)" }}>{authError}</p>
            )}
            <button
              type="submit"
              disabled={checking || !password}
              className="w-full rounded-full py-3 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, oklch(0.62 0.18 280), oklch(0.52 0.16 168))",
                color: "oklch(0.97 0.01 240)",
              }}
            >
              {checking && <Loader2 className="h-4 w-4 animate-spin" />}
              Logg inn
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-5 py-12"
      style={{ background: "oklch(0.13 0.04 280)" }}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-10">
          <img src={logoFull} alt="Liam Bakke Studios" className="h-7 opacity-80"
            style={{ filter: "invert(1)" }} />
          <div className="flex items-center gap-2 text-xs" style={{ color: "oklch(0.55 0.04 265)" }}>
            {saving
              ? <><Loader2 className="h-3 w-3 animate-spin" /> Lagrer…</>
              : toast
              ? <><CheckCircle className="h-3 w-3" style={{ color: "oklch(0.68 0.16 168)" }} /> {toast}</>
              : "Klikk en dato for å blokkere / frigjøre"}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 mb-6 text-xs" style={{ color: "oklch(0.60 0.04 265)" }}>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "oklch(0.55 0.18 25)" }} />
            Opptatt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "oklch(0.32 0.06 280)" }} />
            Ledig
          </span>
        </div>

        {/* Calendar */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            background: "oklch(0.18 0.05 280 / 0.7)",
            borderColor: "oklch(0.32 0.06 280 / 0.5)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "oklch(0.28 0.06 280 / 0.5)" }}>
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="h-4 w-4" style={{ color: "oklch(0.65 0.04 265)" }} />
            </button>
            <span className="font-semibold text-sm" style={{ color: "oklch(0.90 0.02 265)" }}>
              {MONTHS[month.m]} {month.y}
            </span>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronRight className="h-4 w-4" style={{ color: "oklch(0.65 0.04 265)" }} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-4 pt-4 pb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium"
                style={{ color: "oklch(0.50 0.04 265)" }}>
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1 p-4 pt-1">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const ds        = toStr(month.y, month.m, day);
              const isBlocked = blocked.includes(ds);
              const isToday   = ds === today;
              const isPast    = ds < today;

              return (
                <button
                  key={i}
                  onClick={() => !isPast && toggleDate(ds)}
                  disabled={isPast}
                  className="aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center"
                  style={{
                    background: isBlocked
                      ? "oklch(0.40 0.16 25 / 0.5)"
                      : isToday
                      ? "oklch(0.62 0.18 280 / 0.25)"
                      : "transparent",
                    color: isBlocked
                      ? "oklch(0.78 0.14 25)"
                      : isPast
                      ? "oklch(0.35 0.04 265)"
                      : isToday
                      ? "oklch(0.90 0.06 280)"
                      : "oklch(0.80 0.02 265)",
                    border: isToday ? "1px solid oklch(0.62 0.18 280 / 0.5)" : "1px solid transparent",
                    cursor: isPast ? "default" : "pointer",
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blocked list */}
        {blocked.filter(d => d >= today).length > 0 && (
          <div className="mt-6">
            <p className="text-xs mb-3" style={{ color: "oklch(0.50 0.04 265)" }}>
              Blokkerte datoer
            </p>
            <div className="flex flex-wrap gap-2">
              {blocked
                .filter(d => d >= today)
                .sort()
                .map(d => (
                  <button
                    key={d}
                    onClick={() => toggleDate(d)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-all hover:opacity-75"
                    style={{
                      background: "oklch(0.40 0.16 25 / 0.3)",
                      color: "oklch(0.78 0.14 25)",
                      border: "1px solid oklch(0.50 0.16 25 / 0.4)",
                    }}
                  >
                    {new Date(d + "T12:00:00").toLocaleDateString("nb-NO", {
                      weekday: "short", day: "numeric", month: "short"
                    })} ×
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
