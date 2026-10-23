import { useTranslation } from "react-i18next";
import productScreen1 from "../assets/product-screen-1.jpg";
import productScreen2 from "../assets/product-screen-2.jpg";

export function ProductShots() {
  const { t } = useTranslation();
  return (
    <section id="shots">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-kicker">{t("shots-kicker")}</span>
          <h2>{t("shots-title")}</h2>
        </div>
        <div className="shots">
          <figure className="shot">
            <div className="shot-chrome" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <span className="addr"></span>
            </div>
            <img src={productScreen1} alt={t("shot1-alt")} loading="lazy" />
            <figcaption>
              <span className="shot-step">{t("shot1-step")}</span>
              <span>{t("shot1-caption")}</span>
            </figcaption>
          </figure>
          <figure className="shot">
            <div className="shot-chrome" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <span className="addr"></span>
            </div>
            <img src={productScreen2} alt={t("shot2-alt")} loading="lazy" />
            <figcaption>
              <span className="shot-step">{t("shot2-step")}</span>
              <span>{t("shot2-caption")}</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
