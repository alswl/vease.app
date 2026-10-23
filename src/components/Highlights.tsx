import { useTranslation } from "react-i18next";

export function Highlights() {
  const { t } = useTranslation();
  return (
    <section id="highlights">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-kicker">{t("highlights-kicker")}</span>
          <h2>{t("highlights-title")}</h2>
          <p>{t("highlights-desc")}</p>
        </div>
        <div className="bento">
          <div className="feat feat-anchor">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="4" y="6" width="16" height="12" rx="2" />
              <path d="M10 9.5v5l4-2.5z" fill="currentColor" stroke="none" />
              <path d="M2 10v4M22 10v4" />
            </svg>
            <h3>{t("feature1-title")}</h3>
            <p>{t("feature1-desc")}</p>
          </div>
          <div className="feat">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="6" y="3" width="12" height="18" rx="2" />
              <circle cx="12" cy="10" r="2.6" />
              <path d="M9 17.5h6" />
            </svg>
            <h3>{t("feature2-title")}</h3>
            <p>{t("feature2-desc")}</p>
          </div>
          <div className="feat">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
            <h3>{t("feature3-title")}</h3>
            <p>{t("feature3-desc")}</p>
          </div>
          <div className="feat feat-anchor">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 6l3 3 4-4M15 15l3 3 4-4" />
              <path d="M2 8h8M2 17h8" />
              <path d="M13 8h-1M13 17h-1" strokeDasharray="2 3" />
            </svg>
            <h3>{t("feature4-title")}</h3>
            <p>{t("feature4-desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
