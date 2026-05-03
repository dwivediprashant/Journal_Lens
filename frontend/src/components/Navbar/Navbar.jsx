import "./Navbar.css";
import { Link } from "react-router";
import { useLocation } from "react-router";

export default function Navbar() {
  const location = useLocation();
  // console.log(location);
  return (
    <section className="Navbar p-3 text-white">
      <div className="left-nav flex items-center">
        <div>
          <h2 className="font-semibold mr-5">
            Journal<span className="text-blue-300">Lens</span>
            <i className="fa-solid fa-magnifying-glass ms-1"></i>
          </h2>
        </div>
        <div>
          <Link
            className={`${location.pathname === "/" ? "active" : ""}`}
            to="/"
          >
            Home
          </Link>
        </div>
        <div>
          <Link
            className={`${location.pathname === "/journals" ? "active" : ""}`}
            to="/journals"
          >
            Journals
          </Link>
        </div>
      </div>
      <div className="right ms-auto flex mr-4">
        <div>Register</div>
        <div>Login</div>
      </div>
    </section>
  );
}
