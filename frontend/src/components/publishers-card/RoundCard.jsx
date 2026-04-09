import "./RoundCard.css";

export default function RoundCard({ title, src }) {
  return (
    <div className="round-card m-4 p-2">
      <img src={src} alt="" />
      <div className="m-2 text-xl">{title}</div>
    </div>
  );
}
