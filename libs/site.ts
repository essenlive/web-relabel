// Single source of truth for the public site URL.
// Override with NEXT_PUBLIC_BASE_URL (e.g. http://localhost:3000 in dev).
export const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://relabel.essenlive.xyz').replace(/\/$/, '');
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');

export const pageUrl = (path: string) => `${SITE_URL}${path}`;
export const iframeCode = (path: string) =>
  `<iframe src="${SITE_URL}${path}" name="relabel" scrolling="no" frameborder="0" marginheight="0px" marginwidth="0px" height="300px" width="240px" allowfullscreen></iframe>`;
