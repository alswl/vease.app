import { useCallback, useEffect, useState } from "react";
import {
  releaseSource,
  validateMetadata,
  type ValidatedRelease,
} from "../lib/releases";
import { trackDownload } from "../lib/analytics";
import { useTranslation } from "react-i18next";

const currentDownloadVersion = "0.1.1-alpha.5";

function humanSize(bytes: number, language: string): string {
  return `${(bytes / 1024 / 1024).toLocaleString(language === "en" ? "en-US" : "zh-CN", { maximumFractionDigits: 1 })} MB`;
}

function UpcomingPlatforms() {
  const { t } = useTranslation();
  return (
    <>
      {["macOS Intel", "Windows"].map((platform) => (
        <div className="release-card platform-card" key={platform}>
          <h3>{platform}</h3>
          <p className="release-status">{t("platform-coming-soon")}</p>
        </div>
      ))}
    </>
  );
}

export function ReleaseDownloadSection() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage === "zh" ? "zh-CN" : "en";
  const [result, setResult] = useState<ValidatedRelease | null>(null);
  const [message, setMessage] = useState("release-loading");
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(false);
  const load = useCallback(async () => {
    setBusy(true);
    setRetry(false);
    setResult(null);
    setMessage("release-loading");
    try {
      const response = await fetch(releaseSource(), { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setResult(validateMetadata(await response.json()));
    } catch (error) {
      setMessage(
        error instanceof TypeError
          ? "release-network-error"
          : "release-invalid",
      );
      setRetry(true);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const artifacts = result?.release.artifacts ?? [];
  return (
    <section className="final" id="download">
      <div className="wrap">
        <h2>{t("download-title")}</h2>
        <p>{t("download-desc")}</p>
        <div className="download-platforms">
          <div
            id="release-card"
            className="release-card platform-card"
            aria-live="polite"
            aria-busy={busy}
          >
            <h3>macOS Apple Silicon</h3>
            <p id="release-status" className="release-status" role="status">
              {result
                ? result.withdrawn
                  ? t("release-withdrawn")
                  : artifacts.length
                    ? t("release-platform")
                    : t("release-empty")
                : t(message)}
            </p>
            <div id="release-content">
              {result?.withdrawn && (
                <p className="release-status">
                  {t("release-withdrawn-version", {
                    version: result.release.version,
                  })}
                  {result.release.withdrawn &&
                    typeof result.release.withdrawn === "object" && (
                      <>
                        {" "}
                        {result.release.withdrawn.reason || ""}
                        {result.release.withdrawn.replacedBy && (
                          <>
                            {" "}
                            {t("release-replacement", {
                              version: result.release.withdrawn.replacedBy,
                            })}
                          </>
                        )}
                      </>
                    )}
                </p>
              )}
              {result && !result.withdrawn && (
                <>
                  <p className="release-meta">
                    {t("release-version", { version: result.release.version })} ·{" "}
                    {t("release-date", {
                      date: new Date(
                        result.release.releasedAt,
                      ).toLocaleDateString(language),
                    })}{" "}
                    ·{" "}
                    {t("release-updated", {
                      date: new Date(result.data.updatedAt).toLocaleDateString(
                        language,
                      ),
                    })}
                  </p>
                  <div className="release-artifacts">
                    {(["dmg", "zip"] as const).map((format) => {
                      const artifact = artifacts.find(
                        (item) => item.format === format,
                      );
                      return (
                        <div className="release-artifact" key={format}>
                          {!artifact ? (
                            <p className="release-status">
                              {t("release-format-unavailable", {
                                format: format.toUpperCase(),
                              })}
                            </p>
                          ) : (
                            <>
                              <a
                                className="btn"
                                href={artifact.url}
                                aria-label={t("release-download-label", {
                                  version: result.release.version,
                                  format: format.toUpperCase(),
                                })}
                                onClick={() =>
                                  trackDownload(format, result.release.version)
                                }
                              >
                                {t("release-download", {
                                  format: format.toUpperCase(),
                                })}
                              </a>
                              <span className="release-detail">
                                {t("release-size")}{" "}
                                {humanSize(artifact.size, language)} (
                                {artifact.size.toLocaleString("en-US")}{" "}
                                {t("release-bytes")})
                              </span>
                              <span className="release-detail">
                                SHA-256 <code>{artifact.sha256}</code>
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {retry && (
                <button
                  className="release-retry"
                  type="button"
                  onClick={() => void load()}
                >
                  {t("release-retry")}
                </button>
              )}
            </div>
          </div>
          <UpcomingPlatforms />
        </div>
      </div>
    </section>
  );
}

export function DownloadSection() {
  const { t } = useTranslation();
  return (
    <section className="final" id="download">
      <div className="wrap">
        <h2>{t("download-title")}</h2>
        <p>{t("download-desc")}</p>
        <div className="download-platforms">
          <div className="release-card platform-card">
            <h3>macOS Apple Silicon</h3>
            <p className="release-meta">
              {t("release-version", { version: currentDownloadVersion })}
            </p>
            <a
              className="btn"
              href={`https://dl-vease.dijingchao.com/releases/${currentDownloadVersion}/Vease-${currentDownloadVersion}-darwin-arm64.dmg`}
              onClick={() => trackDownload("dmg", currentDownloadVersion)}
            >
              {t("release-download", { format: "DMG" })}
            </a>
          </div>
          <UpcomingPlatforms />
        </div>
      </div>
    </section>
  );
}
