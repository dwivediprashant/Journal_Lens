import "./Search.css";
export default function Search({ placeholder }) {
  return (
    <div>
      <input
        type="text"
        name="search"
        className="search  text-white outline-none"
        placeholder={placeholder}
      />
    </div>
  );
}
