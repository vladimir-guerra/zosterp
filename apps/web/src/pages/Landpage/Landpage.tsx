import { Link } from "react-router-dom";
import css from "./Landpage.module.css";
import { useTranslation } from "react-i18next";

export default function Landpage() {
  const { t } = useTranslation();

  return (
    <>
      <header className={css.header}>
        <div className={css.logo}>Zosterp</div>
        <nav>
          <ul className={css.navList}>
            <li>
              <a href="#features">{t("nav-features")}</a>
            </li>
            <li>
              <a href="#modules">{t("nav-modules")}</a>
            </li>
            <li>
              <a href="#testimonials">{t("nav-testimonials")}</a>
            </li>
            <li>
              <Link to="/auth/login">{t("login")}</Link>
            </li>
            <li>
              <Link to="/auth/register" className={css.btnSecondary}>
                {t("register")}
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className={css.hero}>
          <h1>{t("were-zosterp")}</h1>
          <p>{t("si")}</p>
          <div className={css.heroActions}>
            <Link to="/auth/register" className={css.btnPrimary}>
              {t("join")}
            </Link>
            <a href="#modules" className={css.btnLink}>
              {t("explore-modules")}
            </a>
          </div>
        </section>

        {/* Section 1: Features / Benefits */}
        <section id="features" className={css.features}>
          <h2>{t("features-title")}</h2>
          <p className={css.subtitle}>{t("features-subtitle")}</p>

          <div className={css.grid}>
            <div className={css.card}>
              <h3>{t("feat-cloud-title")}</h3>
              <p>{t("feat-cloud-desc")}</p>
            </div>
            <div className={css.card}>
              <h3>{t("feat-security-title")}</h3>
              <p>{t("feat-security-desc")}</p>
            </div>
            <div className={css.card}>
              <h3>{t("feat-analytics-title")}</h3>
              <p>{t("feat-analytics-desc")}</p>
            </div>
          </div>
        </section>

        {/* Section 2: ERP Modules */}
        <section id="modules" className={css.modules}>
          <h2>{t("modules-title")}</h2>
          <div className={css.modulesGrid}>
            <div className={css.moduleItem}>
              <h4>{t("mod-finance")}</h4>
              <p>{t("mod-finance-desc")}</p>
            </div>
            <div className={css.moduleItem}>
              <h4>{t("mod-inventory")}</h4>
              <p>{t("mod-inventory-desc")}</p>
            </div>
            <div className={css.moduleItem}>
              <h4>{t("mod-hr")}</h4>
              <p>{t("mod-hr-desc")}</p>
            </div>
            <div className={css.moduleItem}>
              <h4>{t("mod-sales")}</h4>
              <p>{t("mod-sales-desc")}</p>
            </div>
          </div>
        </section>

        {/* Section 3: Testimonials / Social Proof */}
        <section id="testimonials" className={css.testimonials}>
          <h2>{t("testimonials-title")}</h2>
          <div className={css.testimonialCard}>
            <blockquote>"{t("testimonial-text")}"</blockquote>
            <cite>{t("testimonial-author")}</cite>
          </div>
        </section>
      </main>

      <footer className={css.footer}>
        <div className={css.footerGrid}>
          <div>
            <h5>Zosterp</h5>
            <p>{t("footer-tagline")}</p>
          </div>
          <div>
            <h5>{t("footer-links-title")}</h5>
            <ul>
              <li>
                <a href="#features">{t("nav-features")}</a>
              </li>
              <li>
                <a href="#modules">{t("nav-modules")}</a>
              </li>
              <li>
                <a href="#">{t("footer-pricing")}</a>
              </li>
            </ul>
          </div>
          <div>
            <h5>{t("footer-legal-title")}</h5>
            <ul>
              <li>
                <a href="#">{t("footer-privacy")}</a>
              </li>
              <li>
                <a href="#">{t("footer-terms")}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={css.footerBottom}>
          <p>
            &copy; {new Date().getFullYear()} Zosterp. {t("footer-rights")}
          </p>
        </div>
      </footer>
    </>
  );
}
