import type { ReactElement } from 'react';

export function Markup({ html, className }: { html: string; className?: string }): ReactElement {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
