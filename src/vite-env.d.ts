/// <reference types="vite/client" />

declare module '*.html?raw' {
  const html: string;
  export default html;
}

interface Window {
  dataLayer?: unknown[][];
  gtag?: (...args: unknown[]) => void;
}
