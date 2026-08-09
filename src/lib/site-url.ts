/**
 * Resolves the public-facing origin for building redirect URLs.
 * Behind Hostinger's reverse proxy, req.nextUrl.origin / the raw Host
 * header can come through as an internal address (e.g. 0.0.0.0:3000),
 * so prefer headers that reflect what the browser actually requested.
 */
export function resolveOrigin(req: Request): string {
  const origin = req.headers.get("origin");
  if (origin) return origin;

  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const proto = req.headers.get("x-forwarded-proto") || "https";
    return `${proto}://${forwardedHost}`;
  }

  const host = req.headers.get("host");
  if (host && host !== "0.0.0.0:3000") {
    const proto = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    return `${proto}://${host}`;
  }

  return "https://www.surfacegrowthco.com";
}
