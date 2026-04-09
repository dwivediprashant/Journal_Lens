import "./Card.css";

export default function Card({ desc, src }) {
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
          <button className="text-white p-2">See details</button>
          <button className="text-white p-2">Go to website</button>
        </div>
      </div>
    </div>
  );
}
