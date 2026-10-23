import { useTranslation } from "react-i18next";

export function Workflow() {
  const { t } = useTranslation();
  return (
    <section id="workflow">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-kicker">{t("workflow-kicker")}</span>
          <h2>{t("workflow-title")}</h2>
          <p>{t("workflow-desc")}</p>
        </div>
        <div className="steps">
          <div className="step">
            <span className="step-no">01</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M8 5v14M16 5v14M3 10h5M3 14h5M16 10h5M16 14h5" />
              </svg>
            </div>
            <h3>{t("step1-title")}</h3>
            <p>{t("step1-desc")}</p>
          </div>
          <div className="step">
            <span className="step-no">02</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </div>
            <h3>{t("step2-title")}</h3>
            <p>{t("step2-desc")}</p>
          </div>
          <div className="step">
            <span className="step-no">03</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 4h14M5 9h9M5 14h14M5 19h9" />
              </svg>
            </div>
            <h3>{t("step3-title")}</h3>
            <p>{t("step3-desc")}</p>
          </div>
          <div className="step">
            <span className="step-no">04</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="6" cy="6" r="2.6" />
                <circle cx="6" cy="18" r="2.6" />
                <path d="M8 7.6L20 18M8 16.4L20 6" />
              </svg>
            </div>
            <h3>{t("step4-title")}</h3>
            <p>{t("step4-desc")}</p>
          </div>
          <div className="step">
            <span className="step-no">05</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5" />
              </svg>
            </div>
            <h3>{t("step5-title")}</h3>
            <p>{t("step5-desc")}</p>
          </div>
          <div className="step">
            <span className="step-no">06</span>
            <div className="step-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16" />
              </svg>
            </div>
            <h3>{t("step6-title")}</h3>
            <p>{t("step6-desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
