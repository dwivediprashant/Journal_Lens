import "./Hero.css";
import { Link } from "react-router";
import PublisherCard from "../publishers-card/PublisherCard.jsx";

export default function Hero() {
  return (
    <>
      <section className="hero-banner" aria-labelledby="hero-title">
        <div className="hero-banner__media" aria-hidden="true">
          <div className="hero-banner__panel hero-banner__panel--left" />
          <div className="hero-banner__panel hero-banner__panel--right" />
        </div>
        <div className="hero-banner__overlay" aria-hidden="true" />
        <div className="hero-banner__content">
          <h1 id="hero-title">Explore Journals</h1>
          <p>
            From timeless theories to modern breakthroughs, discover the
            scientists, thinkers, and visionaries whose ideas still shape the
            world today.
          </p>
          <div className="hero-banner__actions">
            <Link className="hero-banner__cta" to="/journals">
              <span>Explore Journals</span>
              <i className="fa-solid fa-sheet-plastic" />
            </Link>
          </div>
        </div>
      </section>
      <div className="flex justify-around p-5">
        <PublisherCard />
      </div>
    </>
  );
}
