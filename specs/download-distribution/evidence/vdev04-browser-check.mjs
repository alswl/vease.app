import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const playwrightPath = process.env.VDEV02_PLAYWRIGHT ?? path.join(root, '.local-evidence/vdev02-downloads/tmp.YVwMsW/harness/node_modules/playwright-core');
const { chromium } = require(playwrightPath);
const fixtureDir = path.join(root, '.local-evidence/vdev02-downloads/fixtures');
const baseUrl = process.env.VDEV02_BASE_URL ?? 'http://127.0.0.1:4173/';
const chromePath = process.env.VDEV02_CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
assert.ok(process.env.VDEV02_TMPDIR, 'VDEV02_TMPDIR must point inside the worktree task-unique directory');
const available = JSON.parse(await readFile(path.join(fixtureDir, 'available.json'), 'utf8'));

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  pipe: true,
  args: ['--no-first-run', '--disable-background-networking'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const pageErrors = [];
const noIdPage = await context.newPage();
noIdPage.on('pageerror', error => pageErrors.push(error.message));
await noIdPage.route('https://vlogo-dl.dijingchao.com/releases/9.9.9-test.1/**', route => route.fulfill({
  status: 200,
  contentType: 'application/octet-stream',
  headers: { 'content-disposition': 'attachment; filename="fixture.zip"' },
  body: 'synthetic download with no measurement ID',
}));
await noIdPage.goto(new URL('?fixture=available', baseUrl).toString(), { waitUntil: 'networkidle' });
await noIdPage.waitForFunction(() => document.querySelector('#release-card')?.getAttribute('aria-busy') === 'false');
assert.equal(await noIdPage.evaluate(() => ({
  measurementId: document.querySelector('meta[name="ga4-measurement-id"]')?.content,
  tagCount: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
  gtag: typeof window.gtag,
  dataLayer: typeof window.dataLayer,
})).then(result => result.measurementId === '' && result.tagCount === 0 && result.gtag === 'undefined' && result.dataLayer === 'undefined'), true);

const gaPage = await context.newPage();
gaPage.on('pageerror', error => pageErrors.push(error.message));
const tagRequests = [];
const eventEndpointRequests = [];
const artifactRequests = [];
await gaPage.route('http://127.0.0.1:4173/**', async route => {
  if (!route.request().isNavigationRequest()) return route.continue();
  const response = await route.fetch();
  const original = await response.text();
  const configured = original.replace(
    '<meta name="ga4-measurement-id" content="">',
    '<meta name="ga4-measurement-id" content="G-TEST000000">',
  );
  assert.notEqual(configured, original, 'only the intercepted local response receives the test measurement ID');
  await route.fulfill({ response, body: configured });
});
await gaPage.route('https://www.googletagmanager.com/gtag/js?id=G-TEST000000', async route => {
  tagRequests.push(route.request().url());
  await route.fulfill({
    contentType: 'application/javascript',
    body: `
      window.vdev04Events = [];
      window.vdev04Commands = [];
      const queued = Array.from(window.dataLayer || [], command => Array.from(command));
      window.dataLayer = [];
      window.gtag = (...args) => {
        window.vdev04Commands.push(args);
        if (args[0] === 'event') window.vdev04Events.push({ name: args[1], params: args[2] || null });
      };
      queued.forEach(command => window.gtag(...command));
    `,
  });
});
await gaPage.route('https://www.google-analytics.com/**', async route => {
  eventEndpointRequests.push(route.request().url());
  await route.abort();
});
await gaPage.route('https://vlogo-dl.dijingchao.com/releases/9.9.9-test.1/**', async route => {
  artifactRequests.push(route.request().url());
  const extension = route.request().url().endsWith('.dmg') ? 'dmg' : 'zip';
  await route.fulfill({
    status: 200,
    contentType: 'application/octet-stream',
    headers: { 'content-disposition': `attachment; filename="fixture.${extension}"` },
    body: `synthetic ${extension} GA fixture`,
  });
});

async function openFixture(name, width = 1440) {
  await gaPage.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
  await gaPage.goto(new URL(`?fixture=${name}&probe=SENSITIVE-CANARY`, baseUrl).toString(), { waitUntil: 'networkidle' });
  await gaPage.waitForFunction(() => document.querySelector('#release-card')?.getAttribute('aria-busy') === 'false');
  await gaPage.waitForFunction(() => Array.isArray(window.vdev04Events));
  return gaPage.evaluate(() => ({
    events: window.vdev04Events,
    commands: window.vdev04Commands.map(args => ({ action: args[0], name: args[1], params: args[2] || null })),
    tag: document.querySelector('script[src*="googletagmanager.com/gtag/js"]')?.src,
  }));
}

const valid = await openFixture('available');
assert.equal(valid.tag, 'https://www.googletagmanager.com/gtag/js?id=G-TEST000000');
assert.deepEqual(tagRequests, [valid.tag]);
assert.equal(valid.commands.filter(command => command.action === 'config').length, 1);
assert.equal(valid.commands.find(command => command.action === 'config').name, 'G-TEST000000');
const pageViews = valid.events.filter(event => event.name === 'page_view');
assert.equal(pageViews.length, 1);
assert.equal(pageViews[0].params, null);
const config = valid.commands.find(command => command.action === 'config').params;
assert.equal(config.page_location, 'http://127.0.0.1:4173/');
assert.equal(config.page_title, 'Vlogo');
assert.equal(JSON.stringify(valid).includes('SENSITIVE-CANARY'), false);

for (const format of ['DMG', 'ZIP']) {
  const downloadPromise = gaPage.waitForEvent('download');
  await gaPage.getByRole('link', { name: new RegExp(`下载 Vlogo 9\\.9\\.9-test\\.1 ${format}`) }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), `fixture.${format.toLowerCase()}`);
}
const clickEvents = await gaPage.evaluate(() => window.vdev04Events.filter(event => event.name === 'download_click'));
assert.equal(clickEvents.length, 2);
assert.deepEqual(clickEvents.map(event => event.params.format).sort(), ['dmg', 'zip']);
for (const event of clickEvents) {
  assert.deepEqual(Object.keys(event.params).sort(), ['arch', 'format', 'os', 'version']);
  assert.equal(event.params.arch, 'arm64');
  assert.equal(event.params.os, 'darwin');
  assert.equal(event.params.version, available.latest);
  assert.equal(JSON.stringify(event.params).includes('SENSITIVE-CANARY'), false);
}
assert.deepEqual(artifactRequests, available.releases[0].artifacts.map(item => item.url));
await gaPage.locator('#download').scrollIntoViewIfNeeded();
await gaPage.screenshot({ path: path.join(evidenceDir, 'vdev04-ga-downloads.png') });

const narrow = await openFixture('available', 390);
assert.equal(narrow.events.filter(event => event.name === 'page_view').length, 1);
assert.equal(narrow.events.filter(event => event.name === 'download_click').length, 0);
const narrowSize = await gaPage.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
assert.ok(narrowSize.scrollWidth <= narrowSize.width, `narrow viewport overflows: ${JSON.stringify(narrowSize)}`);
await gaPage.locator('#download').scrollIntoViewIfNeeded();
await gaPage.screenshot({ path: path.join(evidenceDir, 'vdev04-ga-narrow.png') });

for (const [fixture, screenshot] of [
  ['no-artifacts', 'vdev04-ga-no-artifact.png'],
  ['invalid', 'vdev04-ga-invalid-no-download.png'],
  ['withdrawn', 'vdev04-ga-withdrawn-no-download.png'],
]) {
  const result = await openFixture(fixture);
  assert.equal(result.events.filter(event => event.name === 'page_view').length, 1);
  assert.equal(result.events.filter(event => event.name === 'download_click').length, 0);
  assert.equal(await gaPage.locator('#release-content a').count(), 0);
  await gaPage.locator('#download').scrollIntoViewIfNeeded();
  await gaPage.screenshot({ path: path.join(evidenceDir, screenshot) });
}

assert.equal(tagRequests.length, 5);
assert.deepEqual(eventEndpointRequests, []);
assert.deepEqual(pageErrors, []);
console.log(JSON.stringify({
  browser: await browser.version(),
  transport: 'Playwright pipe; isolated context',
  measurementId: 'G-TEST000000 (intercepted local response only)',
  measurementTag: tagRequests[0],
  pageViews: 'one per page load',
  downloadClicks: clickEvents.map(event => event.params),
  noId: 'empty meta; no tag, gtag, or dataLayer',
  unavailableStates: 'no-artifacts, invalid, withdrawn emitted zero download_click events',
  sensitiveQueryCanarySent: false,
  googleEventRequests: eventEndpointRequests.length,
  narrowViewport: narrowSize,
  pageErrors,
  result: 'all assertions passed',
}, null, 2));
await context.close();
await browser.close();
