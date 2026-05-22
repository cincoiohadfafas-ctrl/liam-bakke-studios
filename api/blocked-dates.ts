import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put, list } from "@vercel/blob";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    try {
      const { blobs } = await list({ prefix: "blocked-dates" });
      if (blobs.length === 0) return res.json({ dates: [] });
      const r = await fetch(blobs[0].url + `?t=${Date.now()}`);
      const data = await r.json();
      return res.json(data);
    } catch {
      return res.json({ dates: [] });
    }
  }

  if (req.method === "POST") {
    const { password, dates } = req.body as { password: string; dates?: string[] };
    if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Feil passord" });
    }
    if (dates !== undefined) {
      await put("blocked-dates.json", JSON.stringify({ dates }), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
    }
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
