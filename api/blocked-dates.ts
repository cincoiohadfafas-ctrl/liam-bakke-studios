import type { VercelRequest, VercelResponse } from "@vercel/node";

const BIN_ID = "6a101b256877513b27b38dad";
const API_KEY = process.env.JSONBIN_API_KEY!;
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "GET") {
    try {
      const r = await fetch(`${BIN_URL}/latest`, {
        headers: { "X-Master-Key": process.env.JSONBIN_API_KEY ?? "" },
      });
      const data = await r.json();
      return res.json(data.record ?? { dates: [] });
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
      await fetch(BIN_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Master-Key": API_KEY,
        },
        body: JSON.stringify({ dates }),
      });
    }
    return res.json({ ok: true });
  }

  return res.status(405).end();
}
