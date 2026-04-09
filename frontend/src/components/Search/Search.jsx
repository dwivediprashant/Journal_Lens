import "./Search.css";
export default function Search({ placeholder }) {
  return (
    <div className="search-wrap">
      <input
        type="text"
        name="search"
        className="search text-white outline-none"
        placeholder={placeholder}
      />
      <i className="fa-solid fa-magnifying-glass m-5 text-2xl"></i>
    </div>
  );
}
