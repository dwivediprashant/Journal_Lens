import "./Card.css";
import { useNavigate } from "react-router";

export default function Card({ field, id, desc, src }) {
  const navigate = useNavigate();
  const fieldQuery = field || "";
  const handleCardClick = (e) => {
    e.preventDefault();
    navigate(
      `/journals/${id}?field=${encodeURIComponent(fieldQuery)}&desc=${encodeURIComponent(desc)}`,
    );
  };
  return (
    <div
      onClick={handleCardClick}
      className="card text-black rounded-lg overflow-hidden cursor-pointer"
    >
      <div className="p-2">
        <img src={src} alt="" className="img" />
      </div>
      <div className="details">
        <div className="field-pill"># {field}</div>
        <div className="card-description">
          <span>
            {(desc || "").slice(0, 220)}
            <span className="text-blue-500"> ... See in detail</span>
          </span>
        </div>
        <div className="btn-container-card">
          <button
            className="text-white p-2 rounded-lg"
            onClick={handleCardClick}
          >
            See papers
          </button>

          {/* <button className="text-white p-2">Go to website</button> */}
        </div>
      </div>
    </div>
  );
}
