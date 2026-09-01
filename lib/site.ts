const FALLBACK_SITE_URL = 'https://blog.platben.com';

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) return FALLBACK_SITE_URL;

  try {
    const candidate = configuredUrl.includes('://')
      ? configuredUrl
      : `https://${configuredUrl}`;
    const url = new URL(candidate);

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return FALLBACK_SITE_URL;
    }

    return url.origin;
  } catch {
    console.warn('SITE_URL is invalid; using the default site URL.');
    return FALLBACK_SITE_URL;
  }
}
