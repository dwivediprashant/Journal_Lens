import "./RoundCard.css";
import { Link } from "react-router";

export default function RoundCard({ title, src }) {
  return (
    <Link to={"/providers"}>
      <div className="round-card">
        <img src={src} alt="" />
        <div className="round-card-title">{title}</div>
      </div>
    </Link>
  );
}
