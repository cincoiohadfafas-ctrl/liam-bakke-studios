export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const EMAIL = "contact.liambakke@gmail.com";
export const PHONE = "+47 452 24 437";
export const INSTAGRAM_URL = "https://instagram.com/liam_bakke";
export const SPOTIFY_URL = "https://open.spotify.com/artist/liambakke";
export const TIKTOK_URL = "https://www.tiktok.com/@prod.liambakke";
