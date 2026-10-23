import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="wrap foot">
        <div className="brand">
          <svg
            className="brand-mark"
            viewBox="0 0 160 160"
            role="img"
            aria-label="Vease"
          >
            <defs>
              <linearGradient
                id="vtm2-left"
                x1="23"
                y1="29"
                x2="78"
                y2="126"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#795FFF" />
                <stop offset="1" stopColor="#5647DE" />
              </linearGradient>
              <linearGradient
                id="vtm2-right"
                x1="76"
                y1="126"
                x2="137"
                y2="29"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5367EE" />
                <stop offset="1" stopColor="#22C8D3" />
              </linearGradient>
              <mask
                id="vtm2-perforations"
                maskUnits="userSpaceOnUse"
                x="16"
                y="25"
                width="66"
                height="110"
              >
                <rect x="16" y="25" width="66" height="110" fill="#fff" />
                <rect
                  x="33"
                  y="42"
                  width="7"
                  height="10"
                  rx="1.8"
                  transform="rotate(-28 36.5 47)"
                  fill="#000"
                />
                <rect
                  x="44"
                  y="63"
                  width="7"
                  height="10"
                  rx="1.8"
                  transform="rotate(-28 47.5 68)"
                  fill="#000"
                />
              </mask>
              <mask
                id="vtm2-edit-cut"
                maskUnits="userSpaceOnUse"
                x="65"
                y="25"
                width="82"
                height="110"
              >
                <rect x="65" y="25" width="82" height="110" fill="#fff" />
                <path
                  d="m105 68 19 10"
                  stroke="#000"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            <path
              d="M29 30h21l31 63-13 28-46-81c-2.5-4.5.5-10 7-10Z"
              fill="url(#vtm2-left)"
              mask="url(#vtm2-perforations)"
            />
            <path
              d="M131 30h-21L78 95l-10 22 4 8c3.5 7 12.5 7 16 0l49-85c3-5 0-10-6-10Z"
              fill="url(#vtm2-right)"
              mask="url(#vtm2-edit-cut)"
            />
          </svg>
          <a className="brand-domain" href="https://vease.app/">vease.app</a>
        </div>
        <p>{t("footer-copy")}</p>
        <a className="footer-share-link" href="/banner/">
          {t("footer-share")}
        </a>
      </div>
    </footer>
  );
}
