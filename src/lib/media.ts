// Central helper for local-only image paths.

const withBasePath = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
};

export function getImageUrl(rawPath?: string | null): string | undefined {
  if (!rawPath) return undefined;
  if (/^(data|blob):/i.test(rawPath)) return rawPath;
  if (/^https?:\/\//i.test(rawPath)) {
    try {
      const url = new URL(rawPath);
      return url.hostname === 'images.unsplash.com' ? rawPath : undefined;
    } catch {
      return undefined;
    }
  }
  return withBasePath(rawPath);
}
