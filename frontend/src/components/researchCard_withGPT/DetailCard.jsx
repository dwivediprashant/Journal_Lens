import "./DetailCard.css";
export default function DetailCard({ tag, title, onOpenChat }) {
  return (
    <div className="detail-card-wrapper text-center">
      <div className="tag text-sm">#{tag.toUpperCase()}</div>
      <div className="detail-wrap">
        <div className="title">{title}</div>
        <div className="detail-card-btn ">
          <button onClick={onOpenChat}>Ask GPT</button>
          <button>Go to website</button>
        </div>
      </div>
    </div>
  );
}
