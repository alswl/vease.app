import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const screenshotDir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const playwrightPath = process.env.VDEV02_PLAYWRIGHT ?? path.join(root, '.local-evidence/vdev02-downloads/tmp.YVwMsW/harness/node_modules/playwright-core');
const { chromium } = require(playwrightPath);
const fixtureDir = path.join(root, '.local-evidence/vdev02-downloads/fixtures');
const baseUrl = process.env.VDEV02_BASE_URL ?? 'http://127.0.0.1:4173/';
const chromePath = process.env.VDEV02_CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const tmpDir = process.env.VDEV02_TMPDIR;
assert.ok(tmpDir, 'VDEV02_TMPDIR must point inside the worktree task-unique directory');
const availableFixture = JSON.parse(await readFile(path.join(fixtureDir, 'available.json'), 'utf8'));

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  pipe: true,
  args: ['--no-first-run', '--disable-background-networking'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
const page = await context.newPage();
const interceptedDownloads = [];
const defaultMetadataRequests = [];
await page.route('https://vlogo-dl.dijingchao.com/releases/channels/stable.json', async route => {
  defaultMetadataRequests.push(route.request().url());
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify(availableFixture),
  });
});
await page.route('https://vlogo-dl.dijingchao.com/releases/9.9.9-test.1/**', async route => {
  const requestUrl = route.request().url();
  interceptedDownloads.push(requestUrl);
  const extension = requestUrl.endsWith('.dmg') ? 'dmg' : 'zip';
  await route.fulfill({
    status: 200,
    contentType: 'application/octet-stream',
    headers: { 'content-disposition': `attachment; filename="Vlogo-9.9.9-test.1-darwin-arm64.${extension}"` },
    body: `synthetic ${extension} browser acceptance fixture`,
  });
});

async function openFixture(name, width = 1440) {
  await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
  await page.goto(new URL(`?fixture=${name}`, baseUrl).toString(), { waitUntil: 'networkidle' });
  await page.locator('#release-status').waitFor();
  await page.waitForFunction(() => document.querySelector('#release-card')?.getAttribute('aria-busy') === 'false');
  const status = (await page.locator('#release-status').innerText()).trim();
  const links = await page.locator('#release-content a').evaluateAll(nodes => nodes.map(node => ({
    text: node.innerText.trim(),
    href: node.href,
    label: node.getAttribute('aria-label'),
  })));
  return { status, links };
}

const available = await openFixture('available');
assert.match(available.status, /macOS Apple Silicon/);
assert.equal(available.links.length, 2);
await page.getByRole('link', { name: '下载 macOS 版' }).click();
await page.waitForFunction(() => location.hash === '#download');
for (const format of ['dmg', 'zip']) {
  const artifact = availableFixture.releases[0].artifacts.find(item => item.format === format);
  const link = available.links.find(item => item.text === `下载 ${format.toUpperCase()}`);
  assert.ok(link, `missing ${format} link`);
  assert.equal(link.href, artifact.url);
  assert.match(link.label, new RegExp(availableFixture.latest));
  assert.match(await page.locator('#release-content').innerText(), new RegExp(artifact.sha256));
  assert.ok((await page.locator('#release-content').innerText()).includes(`${artifact.size.toLocaleString('en-US')} 字节`));
}
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-wide-available.png') });

for (const format of ['DMG', 'ZIP']) {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: new RegExp(`下载 Vlogo 9\\.9\\.9-test\\.1 ${format}`) }).click();
  const download = await downloadPromise;
  const expected = `Vlogo-9.9.9-test.1-darwin-arm64.${format.toLowerCase()}`;
  assert.equal(download.suggestedFilename(), expected);
  const target = path.join(tmpDir, 'downloads', expected);
  await download.saveAs(target);
  assert.equal(await download.failure(), null);
}
assert.equal(interceptedDownloads.length, 2);
assert.ok(interceptedDownloads.some(url => url.endsWith('.dmg')));
assert.ok(interceptedDownloads.some(url => url.endsWith('.zip')));

const narrow = await openFixture('available', 390);
assert.equal(narrow.links.length, 2);
const widths = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
assert.ok(widths.page <= widths.viewport, `narrow page overflows: ${JSON.stringify(widths)}`);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-narrow-available.png') });

const zipOnly = await openFixture('zip-only');
assert.equal(zipOnly.links.length, 1);
assert.equal(zipOnly.links[0].text, '下载 ZIP');
assert.match(await page.locator('#release-content').innerText(), /DMG 暂无可用制品/);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-zip-only.png') });

const withdrawn = await openFixture('withdrawn');
assert.match(withdrawn.status, /已撤回/);
assert.equal(withdrawn.links.length, 0);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-withdrawn.png') });

const noArtifacts = await openFixture('no-artifacts');
assert.match(noArtifacts.status, /没有可下载制品/);
assert.equal(noArtifacts.links.length, 0);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-no-artifacts.png') });

const invalid = await openFixture('invalid');
assert.match(invalid.status, /无法读取有效的发布信息/);
assert.equal(invalid.links.length, 0);
assert.equal(await page.getByRole('button', { name: '重试' }).count(), 1);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-invalid-metadata.png') });

const untrustedUrl = await openFixture('untrusted-url');
assert.match(untrustedUrl.status, /无法读取有效的发布信息/);
assert.equal(untrustedUrl.links.length, 0);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-untrusted-url.png') });

const missing = await openFixture('missing');
assert.match(missing.status, /无法读取有效的发布信息/);
assert.equal(missing.links.length, 0);
await page.getByRole('button', { name: '重试' }).click();
await page.waitForFunction(() => document.querySelector('#release-card')?.getAttribute('aria-busy') === 'false');
assert.match(await page.locator('#release-status').innerText(), /无法读取有效的发布信息/);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-load-failure.png') });

await page.route('**/.local-evidence/vdev02-downloads/fixtures/available.json', route => route.abort('failed'));
const networkFailure = await openFixture('available');
assert.match(networkFailure.status, /无法连接版本服务/);
assert.equal(networkFailure.links.length, 0);
await page.locator('#download').scrollIntoViewIfNeeded();
await page.screenshot({ path: path.join(screenshotDir, 'vdev02-network-failure.png') });
await page.unroute('**/.local-evidence/vdev02-downloads/fixtures/available.json');

await page.goto(baseUrl, { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('#release-card')?.getAttribute('aria-busy') === 'false');
assert.deepEqual(defaultMetadataRequests, ['https://vlogo-dl.dijingchao.com/releases/channels/stable.json']);
assert.equal(await page.locator('#release-content a').count(), 2);

const summary = {
  browser: await browser.version(),
  pipeTransport: true,
  isolatedContext: true,
  viewport: { wide: '1440x1000', narrow: '390x844', narrowFits: widths.page <= widths.viewport },
  fixtureChecks: ['available', 'zip-only', 'withdrawn', 'no-artifacts', 'invalid', 'untrusted-url', 'missing', 'network failure'],
  defaultMetadataURL: defaultMetadataRequests[0],
  actualClicks: interceptedDownloads,
  results: 'all assertions passed',
};
console.log(JSON.stringify(summary, null, 2));
await context.close();
await browser.close();
