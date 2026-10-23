import { useTranslation } from "react-i18next";
import productScreen1 from "../assets/product-screen-1.jpg";
import productScreen2 from "../assets/product-screen-2.jpg";

export function ProductShots() {
  const { t } = useTranslation();
  return (
    <section id="shots" aria-label={t("shots-title")}>
      <div className="wrap">
        <div className="shots">
          {[{ image: productScreen2, key: "shot2" }, { image: productScreen1, key: "shot1" }].map(({ image, key }, index) => (
            <figure className="shot" key={key}>
              <img src={image} alt={t(`${key}-alt`)} loading={index === 0 ? "eager" : "lazy"} width="1600" height="1000" />
              <figcaption>
                <span className="shot-step">{t(`${key}-step`)}</span>
                <span>{t(`${key}-caption`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
