import { useTranslation, Trans } from "react-i18next";

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="wrap">
        <span className="hero-eyebrow">
          <span className="dot" />
          {t("hero-eyebrow")}
        </span>
        <h1>
          <Trans
            i18nKey="hero-title"
            components={{ gradient: <span className="grad" /> }}
          />
        </h1>
        <p className="sub">
          <Trans
            i18nKey="hero-sub"
            components={{ gradient: <span className="grad" /> }}
          />
        </p>
        <div className="cta-row">
          <a className="btn" href="#download">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16" />
            </svg>
            <span>{t("hero-download")}</span>
          </a>
          <span className="cta-note">{t("hero-note")}</span>
        </div>
        <p className="hero-req">{t("hero-req")}</p>
      </div>
    </section>
  );
}
