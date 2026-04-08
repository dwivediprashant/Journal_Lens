import "./Card.css";

export default function Card({
  title,
  desc,
  headerColor = "bg-gray-800",
  bodyColor = "bg-gray-400",
  src,
}) {
  return (
    <div className="card text-black rounded-lg overflow-hidden">
      <div className="p-2">
        <img src={src} alt="" className="img" />
      </div>
      <div className="details">
        <div className={`${headerColor} p-5`}>
          <h4>{title}</h4>
        </div>
        <div className={`${bodyColor} p-5`}>
          <p>{desc}</p>
        </div>
      </div>
    </div>
  );
}
