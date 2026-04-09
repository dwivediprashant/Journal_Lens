import "./Navbar.css";
import { Link } from "react-router";
export default function Navbar() {
  return (
    <section className="Navbar p-3 text-white">
      <div className="left-nav flex ">
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/journals">Journals</Link>
        </div>
      </div>
      <div className="right ms-auto flex mr-4">
        <div>Register</div>
        <div>Login</div>
      </div>
    </section>
  );
}
