const metadataUrl = 'https://vlogo-dl.dijingchao.com/releases/channels/stable.json';
const localFixtures = new Set(['available', 'zip-only', 'withdrawn', 'no-artifacts', 'invalid', 'untrusted-url', 'missing']);
const allowedHost = 'vlogo-dl.dijingchao.com';
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(-((0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(\.(0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?$/;

export type Artifact = { os: 'darwin'; arch: 'arm64'; format: 'dmg' | 'zip'; url: string; sha256: string; size: number };
type Release = { version: string; releasedAt: string; artifacts: Artifact[]; withdrawn?: { reason?: string; replacedBy?: string } | false };
type Metadata = { updatedAt: string; latest: string; releases: Release[] };
export type ValidatedRelease = { data: Metadata; release: Release; withdrawn: boolean };

function isDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function validateMetadata(data: any): ValidatedRelease {
  if (!data || data.schemaVersion !== 1 || data.channel !== 'stable' || !isDate(data.updatedAt) ||
      typeof data.latest !== 'string' || !semver.test(data.latest) || !Array.isArray(data.releases)) {
    throw new Error('发布元数据格式无效');
  }
  const release: Release | undefined = data.releases.find((item: any) => item && item.version === data.latest);
  if (!release || !isDate(release.releasedAt) || !Array.isArray(release.artifacts)) {
    throw new Error('找不到 stable 指向的版本');
  }
  if (release.withdrawn) return { data, release, withdrawn: true };
  const seen = new Set<string>();
  for (const artifact of release.artifacts) {
    if (!artifact || artifact.os !== 'darwin' || artifact.arch !== 'arm64' ||
        !['dmg', 'zip'].includes(artifact.format) || seen.has(artifact.format) ||
        typeof artifact.url !== 'string' || typeof artifact.sha256 !== 'string' || !/^[0-9a-f]{64}$/.test(artifact.sha256) ||
        !Number.isSafeInteger(artifact.size) || artifact.size < 1) {
      throw new Error('制品信息格式无效');
    }
    let url: URL;
    try { url = new URL(artifact.url); } catch { throw new Error('制品下载地址无效'); }
    if (url.protocol !== 'https:' || url.hostname !== allowedHost || !url.pathname.startsWith(`/releases/${release.version}/`)) {
      throw new Error('制品下载地址不在允许范围内');
    }
    seen.add(artifact.format);
  }
  return { data, release, withdrawn: false };
}

export function releaseSource(): string {
  const requested = new URLSearchParams(location.search).get('fixture');
  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  return localHost && requested && localFixtures.has(requested) ? `/fixtures/${requested}.json` : metadataUrl;
}
