import { readFile, rm, writeFile } from "node:fs/promises";

const ssrEntry = new URL("../dist-ssr/entry-server.js", import.meta.url);
const indexHtml = new URL("../dist/index.html", import.meta.url);
const mountPoint = '<div id="root"></div>';

const { render } = (await import(ssrEntry.href)) as {
  render: () => Promise<string>;
};
const template = await readFile(indexHtml, "utf8");
if (!template.includes(mountPoint)) {
  throw new Error(`Missing ${mountPoint} in dist/index.html`);
}
await writeFile(
  indexHtml,
  template.replace(mountPoint, `<div id="root">${await render()}</div>`),
);
await rm(new URL("../dist-ssr/", import.meta.url), { recursive: true });
