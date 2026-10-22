const measurementId = document.querySelector<HTMLMetaElement>('meta[name="ga4-measurement-id"]')?.content.trim() ?? '';
const validId = /^G-[A-Z0-9]{10}$/.test(measurementId);

export function initializeAnalytics(): void {
  if (!validId || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  const gtag: NonNullable<Window['gtag']> = (...args) => { window.dataLayer?.push(args); };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { send_page_view: false, page_location: `${location.origin}${location.pathname}`, page_title: 'Vease' });
  gtag('event', 'page_view');
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

export function trackDownload(format: 'dmg' | 'zip', version: string): void {
  if (!validId || typeof window.gtag !== 'function') return;
  window.gtag('event', 'download_click', { format, arch: 'arm64', os: 'darwin', version });
}
