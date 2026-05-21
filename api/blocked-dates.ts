import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list, head } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: "blocked-dates" });
      if (blobs.length === 0) return res.json({ dates: [] });
      const blob = await head(blobs[0].url);
      const r = await fetch(blob.downloadUrl);
      const data = await r.json();
      return res.json(data);
    } catch {
      return res.json({ dates: [] });
    }
  }

  if (req.method === "POST") {
    const { password, dates } = req.body as { password: string; dates: string[] };
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Feil passord" });
    }
    await put("blocked-dates.json", JSON.stringify({ dates }), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
