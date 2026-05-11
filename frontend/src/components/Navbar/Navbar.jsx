import "./Navbar.css";
import { Link } from "react-router";
import { useLocation } from "react-router";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

export default function Navbar() {
  const location = useLocation();
  // console.log(location);
  return (
    <section className="Navbar p-3 text-white">
      <div className="left-nav flex items-center">
        <div className="nav-logo">
          <h2 className="font-semibold mr-5">
            Journal<span className="text-blue-300">Lens</span>
            <i className="fa-solid fa-magnifying-glass ms-1"></i>
          </h2>
        </div>
        <div className="flex gap-3">
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
              Field-wise journals
            </Link>
          </div>
          <div>
            <Link
              className={`${location.pathname === "/providers" ? "active" : ""}`}
              to="/providers"
            >
              Publisher-wise journals
            </Link>
          </div>
        </div>
      </div>
      <div className="right ms-auto flex mr-4">
        <div>
          <Show when="signed-out">
            <SignUpButton mode="modal" fallbackRedirectUrl="/">
              <button className="cursor-pointer">
                Signup{" "}
                <i className="fa-solid fa-right-to-bracket ms-2 fa-lg "></i>
              </button>
            </SignUpButton>
          </Show>
          <div className="rounded-[50%] bg-white">
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </section>
  );
}
