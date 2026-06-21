/**
 * Loads Spectral Bold (TTF) from Google Fonts for use in ImageResponse.
 *
 * Satori (ImageResponse's renderer) only supports TTF/OTF/WOFF — not WOFF2.
 * An IE6 User-Agent forces Google Fonts to return CSS with TTF src URLs.
 *
 * Falls back to Inter Bold if Spectral can't be fetched.
 * Both fetches use next: { revalidate } so they only hit the network once
 * per day; subsequent requests are served from Next.js's fetch cache.
 */

async function fetchTtf(family: string, weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`,
      {
        headers: {
          // IE6 UA → Google Fonts returns TTF, the only format Satori supports
          "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)",
        },
        next: { revalidate: 86400 },
      },
    ).then((r) => r.text());

    const url = css.match(/url\(([^)]+\.ttf)\)/)?.[1];
    if (!url) return null;

    return fetch(url, { next: { revalidate: 86400 } }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export type FontResult = { data: ArrayBuffer; name: string };

export async function spectralBold(): Promise<FontResult> {
  const spectral = await fetchTtf("Spectral", 700);
  if (spectral) return { data: spectral, name: "Spectral" };

  // Bulletproof fallback — Inter is the default Satori font and almost always resolves
  const inter = await fetchTtf("Inter", 700);
  if (inter) return { data: inter, name: "Inter" };

  throw new Error("og-fonts: could not load any font for ImageResponse");
}
