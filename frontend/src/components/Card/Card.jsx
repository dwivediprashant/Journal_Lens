import "./Card.css";
import { Link } from "react-router";
export default function Card({ id, desc, src }) {
  return (
    <div className="card text-black rounded-lg overflow-hidden ">
      <div className="p-2">
        <img src={src} alt="" className="img" />
      </div>
      <div className="details">
        <div className="card-description">
          <span>
            {(desc || "").slice(0, 150)}
            <span className="text-blue-500"> ... See in detail</span>
          </span>
        </div>
        <div className="btn-container-card">
          <button className="text-white p-2">
            <Link to={`/journals/${id}`}>See details</Link>
          </button>

          {/* <button className="text-white p-2">Go to website</button> */}
        </div>
      </div>
    </div>
  );
}
