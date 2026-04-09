import "./RoundCard.css";

export default function RoundCard({ title, src }) {
  return (
    <div className="round-card">
      <img src={src} alt="" />
      <div className="round-card-title">{title}</div>
    </div>
  );
}
