import { useCallback, useEffect, useState } from 'react';
import { releaseSource, validateMetadata, type ValidatedRelease } from '../lib/releases';
import { trackDownload } from '../lib/analytics';

function humanSize(bytes: number): string {
  return `${(bytes / 1024 / 1024).toLocaleString('zh-CN', { maximumFractionDigits: 1 })} MB`;
}

export function DownloadSection() {
  const [result, setResult] = useState<ValidatedRelease | null>(null);
  const [message, setMessage] = useState('正在读取最新版本…');
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(false);
  const load = useCallback(async () => {
    setBusy(true); setRetry(false); setResult(null); setMessage('正在读取最新版本…');
    try {
      const response = await fetch(releaseSource(), { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setResult(validateMetadata(await response.json()));
    } catch (error) {
      setMessage(error instanceof TypeError ? '暂时无法连接版本服务，请检查网络后重试。' : '暂时无法读取有效的发布信息，请稍后重试。');
      setRetry(true);
    } finally { setBusy(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const artifacts = result?.release.artifacts ?? [];
  return <section className="final" id="download">
    <div className="wrap">
      <h2>下一个旅行，回来就能剪</h2>
      <p>导入，看 AI 剪一版，改几句，导出。</p>
      <div id="release-card" className="release-card" aria-live="polite" aria-busy={busy}>
        <h3>macOS Apple Silicon</h3>
        <p id="release-status" className="release-status" role="status">
          {result ? result.withdrawn ? '此版本已撤回' : artifacts.length ? '适用于 macOS Apple Silicon' : '当前版本暂时没有可下载制品' : message}
        </p>
        <div id="release-content">
          {result?.withdrawn && <p className="release-status">版本 {result.release.version} 已撤回。{result.release.withdrawn && typeof result.release.withdrawn === 'object' ? `${result.release.withdrawn.reason || ''}${result.release.withdrawn.replacedBy ? ` 当前请使用 ${result.release.withdrawn.replacedBy}。` : ''}` : ''}</p>}
          {result && !result.withdrawn && <>
            <p className="release-meta">版本 {result.release.version} · 发布于 {new Date(result.release.releasedAt).toLocaleDateString('zh-CN')} · 元数据更新于 {new Date(result.data.updatedAt).toLocaleDateString('zh-CN')}</p>
            <div className="release-artifacts">
              {(['dmg', 'zip'] as const).map(format => {
                const artifact = artifacts.find(item => item.format === format);
                return <div className="release-artifact" key={format}>
                  {!artifact ? <p className="release-status">{format.toUpperCase()} 暂无可用制品</p> : <>
                    <a className="btn" href={artifact.url} aria-label={`下载 Vlogo ${result.release.version} ${format.toUpperCase()}，macOS Apple Silicon`} onClick={() => trackDownload(format, result.release.version)}>下载 {format.toUpperCase()}</a>
                    <span className="release-detail">文件大小 {humanSize(artifact.size)}（{artifact.size.toLocaleString('en-US')} 字节）</span>
                    <span className="release-detail">SHA-256 <code>{artifact.sha256}</code></span>
                  </>}
                </div>;
              })}
            </div>
          </>}
          {retry && <button className="release-retry" type="button" onClick={() => void load()}>重试</button>}
        </div>
      </div>
    </div>
  </section>;
}
