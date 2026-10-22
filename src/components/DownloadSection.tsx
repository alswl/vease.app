import { useCallback, useEffect, useState } from 'react';
import { releaseSource, validateMetadata, type ValidatedRelease } from '../lib/releases';
import { trackDownload } from '../lib/analytics';

function humanSize(bytes: number, language: string): string {
  return `${(bytes / 1024 / 1024).toLocaleString(language === 'en' ? 'en-US' : 'zh-CN', { maximumFractionDigits: 1 })} MB`;
}

export function DownloadSection() {
  const [language, setLanguage] = useState(localStorage.getItem('vease-language') === 'en' ? 'en' : 'zh-CN');
  const en = language === 'en';
  const [result, setResult] = useState<ValidatedRelease | null>(null);
  const [message, setMessage] = useState(en ? 'Loading the latest release…' : '正在读取最新版本…');
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(false);
  const load = useCallback(async () => {
    setBusy(true); setRetry(false); setResult(null); setMessage(en ? 'Loading the latest release…' : '正在读取最新版本…');
    try {
      const response = await fetch(releaseSource(), { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setResult(validateMetadata(await response.json()));
    } catch (error) {
      setMessage(error instanceof TypeError ? (en ? 'Could not connect to the release service. Check your connection and try again.' : '暂时无法连接版本服务，请检查网络后重试。') : (en ? 'Could not read valid release information. Please try again later.' : '暂时无法读取有效的发布信息，请稍后重试。'));
      setRetry(true);
    } finally { setBusy(false); }
  }, [en]);
  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const updateLanguage = (event: Event) => setLanguage((event as CustomEvent<string>).detail);
    window.addEventListener('languagechange', updateLanguage);
    return () => window.removeEventListener('languagechange', updateLanguage);
  }, []);
  const artifacts = result?.release.artifacts ?? [];
  return <section className="final" id="download">
    <div className="wrap">
      <h2 data-i18n="download-title">下一个旅行，回来就能剪</h2>
      <p data-i18n="download-desc">导入，看 AI 剪一版，改几句，导出。</p>
      <div id="release-card" className="release-card" aria-live="polite" aria-busy={busy}>
        <h3>macOS Apple Silicon</h3>
        <p id="release-status" className="release-status" role="status">
          {result ? result.withdrawn ? (en ? 'This release has been withdrawn' : '此版本已撤回') : artifacts.length ? (en ? 'For macOS Apple Silicon' : '适用于 macOS Apple Silicon') : (en ? 'No downloadable files are currently available' : '当前版本暂时没有可下载制品') : message}
        </p>
        <div id="release-content">
          {result?.withdrawn && <p className="release-status">{en ? `Version ${result.release.version} was withdrawn. ` : `版本 ${result.release.version} 已撤回。`}{result.release.withdrawn && typeof result.release.withdrawn === 'object' ? `${result.release.withdrawn.reason || ''}${result.release.withdrawn.replacedBy ? `${en ? ' Use ' : ' 当前请使用 '}${result.release.withdrawn.replacedBy}${en ? '.' : '。'}` : ''}` : ''}</p>}
          {result && !result.withdrawn && <>
            <p className="release-meta">{en ? 'Version ' : '版本 '}{result.release.version} · {en ? 'Released ' : '发布于 '}{new Date(result.release.releasedAt).toLocaleDateString(en ? 'en-US' : 'zh-CN')} · {en ? 'Metadata updated ' : '元数据更新于 '}{new Date(result.data.updatedAt).toLocaleDateString(en ? 'en-US' : 'zh-CN')}</p>
            <div className="release-artifacts">
              {(['dmg', 'zip'] as const).map(format => {
                const artifact = artifacts.find(item => item.format === format);
                return <div className="release-artifact" key={format}>
                  {!artifact ? <p className="release-status">{format.toUpperCase()} {en ? 'is not available' : '暂无可用制品'}</p> : <>
                    <a className="btn" href={artifact.url} aria-label={`${en ? 'Download Vease' : '下载 Vease'} ${result.release.version} ${format.toUpperCase()}，macOS Apple Silicon`} onClick={() => trackDownload(format, result.release.version)}>{en ? 'Download' : '下载'} {format.toUpperCase()}</a>
                    <span className="release-detail">{en ? 'File size' : '文件大小'} {humanSize(artifact.size, language)} ({artifact.size.toLocaleString('en-US')} {en ? 'bytes' : '字节'})</span>
                    <span className="release-detail">SHA-256 <code>{artifact.sha256}</code></span>
                  </>}
                </div>;
              })}
            </div>
          </>}
          {retry && <button className="release-retry" type="button" onClick={() => void load()}>{en ? 'Retry' : '重试'}</button>}
        </div>
      </div>
    </div>
  </section>;
}
