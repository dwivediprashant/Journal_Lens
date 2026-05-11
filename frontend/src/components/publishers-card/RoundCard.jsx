import "./RoundCard.css";
import { Link } from "react-router";
export default function RoundCard({ id, title, src }) {
  return (
    <Link to={`/providers/${id}`} state={src,title}>
      <div className="round-card">
        <img src={src} alt="" />
        <div className="round-card-title">{title}</div>
      </div>
    </Link>
  );
}
