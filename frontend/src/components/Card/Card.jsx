import "./Card.css";

export default function Card({ desc, headerColor = "bg-gray-400", src }) {
  return (
    <div className="card text-black rounded-lg overflow-hidden">
      <div className="p-2">
        <img src={src} alt="" className="img" />
      </div>
      <div className="details">
        <div className={`${headerColor} p-5`}>
          <h4>{desc}</h4>
        </div>
        <div className={`btn-container-card  `}>
          <button className={`${headerColor}  p-2  rounded-xl m-5`}>
            See detail
          </button>
          <button className={`${headerColor}  p-2 rounded-xl m-5`}>
            Go to website
          </button>
        </div>
      </div>
    </div>
  );
}
