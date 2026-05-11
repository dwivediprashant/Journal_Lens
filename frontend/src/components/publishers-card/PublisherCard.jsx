import "./PublisherCard.css";
import RoundCard from "./RoundCard";
import { Link } from "react-router";
export default function PublisherCard() {
  return (
    <div>
      <div className="header">
        <h1 className="w-full text-center p-1">Journal Publishers</h1>
      </div>
      <div className="round-card-wrapper">
        <div className="round-card-container">
          <RoundCard
            id={`P4310320990`}
            title={`Elsevier`}
            src={`/media/publishers/elsevier.png`}
          />
          <RoundCard
            id={`P4310319808`}
            title={`IEEE`}
            src={`/media/publishers/ieee.png`}
          />
          <RoundCard
            id={`P4310319965`}
            title={`Springer`}
            src={`/media/publishers/springer.png`}
          />
          <RoundCard
            id={`P4310320595`}
            title={`Wiley`}
            src={`/media/publishers/wiley.png`}
          />

          <RoundCard
            id={`P4310320017`}
            title={`SAGE Publishing`}
            src={`/media/publishers/sage.png`}
          />
          <RoundCard
            id={`P4310310987`}
            title={`MDPI`}
            src={`/media/publishers/mdpi.png`}
          />
          <RoundCard
            id={`P4310319869`}
            title={`Hindawi`}
            src={`/media/publishers/hindawi.png`}
          />

          <div className="show-more-btn-wrapper">
            <Link to={`/providers`}>
              <button className="show-more-btn">
                <span>Show more</span>
                <i className="fa-solid fa-arrow-right fa-xl mt-3"></i>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
