import "./Navbar.css";
export default function Navbar() {
  return (
    <section className="Navbar p-3 text-white">
      <div className="left-nav flex ">
        <div>Home</div>
        <div>Journals</div>
      </div>
      <div className="right ms-auto flex mr-4">
        <div>Register</div>
        <div>Login</div>
      </div>
    </section>
  );
}
